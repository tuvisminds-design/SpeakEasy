/**
 * Deepgram Voice Agent Service
 * Handles Speech-to-Text (STT) and Text-to-Speech (TTS) using Deepgram API
 */

import { testDeepgramKey } from '../utils/testDeepgramKey';

class DeepgramVoiceAgent {
  constructor() {
    // Only log once on initialization (not on every render)
    if (!DeepgramVoiceAgent._logged) {
      // Debug: Log all REACT_APP_ environment variables
      console.log('🔍 Environment check:', {
        hasKey: !!process.env.REACT_APP_DEEPGRAM_API_KEY,
        keyLength: process.env.REACT_APP_DEEPGRAM_API_KEY?.length || 0,
        keyPreview: process.env.REACT_APP_DEEPGRAM_API_KEY ? 
          process.env.REACT_APP_DEEPGRAM_API_KEY.substring(0, 10) + '...' : 'NOT SET',
        allReactEnvVars: Object.keys(process.env).filter(k => k.startsWith('REACT_APP_'))
      });
      DeepgramVoiceAgent._logged = true;
    }
    
    this.apiKey = process.env.REACT_APP_DEEPGRAM_API_KEY || '';
    
    if (!this.apiKey && !DeepgramVoiceAgent._keyErrorLogged) {
      console.error('❌ Deepgram API key not found!');
      console.error('Please ensure:');
      console.error('1. .env file exists in the project root');
      console.error('2. File contains: REACT_APP_DEEPGRAM_API_KEY=your_key_here');
      console.error('3. Server has been restarted after creating .env file');
      DeepgramVoiceAgent._keyErrorLogged = true;
    } else if (this.apiKey && !DeepgramVoiceAgent._keySuccessLogged) {
      console.log('✅ Deepgram API key loaded successfully');
      DeepgramVoiceAgent._keySuccessLogged = true;
    }
    this.sttConnection = null;
    this.isListening = false;
    this.audioContext = null;
    this.mediaStream = null;
    this.processor = null;
    this.onTranscriptCallback = null;
    this.onErrorCallback = null;
  }

  /**
   * Initialize Deepgram STT connection
   */
  async initializeSTT(onTranscript, onError) {
    if (!this.apiKey) {
      const error = new Error('Deepgram API key is not set. Please set REACT_APP_DEEPGRAM_API_KEY in your .env file');
      console.error('❌', error.message);
      throw error;
    }

    console.log('🔧 Initializing STT with API key:', this.apiKey.substring(0, 10) + '...');

    this.onTranscriptCallback = onTranscript;
    this.onErrorCallback = onError;

    try {
      // Step 1: Get user media (microphone permission)
      console.log('🎤 Requesting microphone access...');
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            channelCount: 1,
            sampleRate: 16000,
            echoCancellation: true,
            noiseSuppression: true,
          } 
        });
        console.log('✅ Microphone access granted');
      } catch (mediaError) {
        console.error('❌ Microphone access denied:', mediaError);
        throw new Error('Microphone permission denied. Please allow microphone access in your browser settings.');
      }

      // Step 2: Create audio context
      console.log('🔊 Setting up audio processing...');
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      // Create script processor for audio processing
      const bufferSize = 4096;
      const processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
      
      processor.onaudioprocess = (e) => {
        if (this.isListening && this.sttConnection && this.sttConnection.readyState === WebSocket.OPEN) {
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = this.convertFloat32ToPCM16(inputData);
          this.sttConnection.send(pcm16);
        }
      };

      source.connect(processor);
      processor.connect(this.audioContext.destination);
      this.processor = processor;
      console.log('✅ Audio processing setup complete');

      // Step 3: Create WebSocket connection to Deepgram
      console.log('🌐 Connecting to Deepgram WebSocket...');
      
      // Validate API key format first
      if (!/^[a-f0-9]{40}$/i.test(this.apiKey)) {
        const error = new Error(`Invalid API key format. Expected 40-character hex string, got ${this.apiKey.length} characters.`);
        console.error('❌', error.message);
        throw error;
      }
      
      // Build WebSocket URL with proper encoding
      // Deepgram WebSocket authentication: token as query parameter
      const params = new URLSearchParams({
        model: 'nova-2',
        language: 'en-US',
        punctuate: 'true',
        interim_results: 'true',
        encoding: 'linear16',
        sample_rate: '16000',
        channels: '1'
      });
      
      // Add token to URL - Deepgram requires it as a query parameter
      const wsUrl = `wss://api.deepgram.com/v1/listen?${params.toString()}&token=${encodeURIComponent(this.apiKey)}`;
      
      console.log('🔗 WebSocket URL (token hidden):', wsUrl.replace(this.apiKey, 'TOKEN_HIDDEN'));
      console.log('🔑 API Key info:', {
        length: this.apiKey.length,
        format: /^[a-f0-9]{40}$/i.test(this.apiKey) ? '✅ Valid format' : '❌ Invalid format',
        preview: this.apiKey.substring(0, 10) + '...' + this.apiKey.substring(this.apiKey.length - 4),
        startsWith: this.apiKey.substring(0, 2)
      });
      
      // Test API key with a simple REST call first (optional, for debugging)
      console.log('🧪 Testing API key validity...');
      try {
        const testResponse = await fetch('https://api.deepgram.com/v1/projects', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (testResponse.ok) {
          console.log('✅ API key is valid (REST API test passed)');
        } else if (testResponse.status === 401) {
          console.error('❌ API key authentication failed (401 Unauthorized)');
          throw new Error('Invalid API key. Please check your API key at https://console.deepgram.com/');
        } else {
          console.warn('⚠️ API key test returned status:', testResponse.status);
        }
      } catch (testError) {
        console.warn('⚠️ Could not test API key (this is okay, proceeding with WebSocket):', testError.message);
      }
      
      console.log('💡 If connection fails, check:');
      console.log('   1. API key is active at: https://console.deepgram.com/');
      console.log('   2. API key has WebSocket/STT permissions enabled');
      console.log('   3. Check browser Network tab → WS filter for WebSocket details');
      console.log('   4. Try opening browser console to see detailed connection logs');
      
      this.sttConnection = new WebSocket(wsUrl);

      // Wait for WebSocket to open with timeout
      return new Promise((resolve, reject) => {
        let connectionTimeout;
        let isResolved = false;

        // Set timeout for connection (10 seconds)
        connectionTimeout = setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            const error = new Error('WebSocket connection timeout. Please check your internet connection and API key.');
            console.error('❌', error.message);
            if (this.sttConnection) {
              this.sttConnection.close();
            }
            if (this.onErrorCallback) {
              this.onErrorCallback(error);
            }
            reject(error);
          }
        }, 10000);

        this.sttConnection.onopen = () => {
          if (!isResolved) {
            isResolved = true;
            clearTimeout(connectionTimeout);
            console.log('✅ Deepgram STT connection opened successfully');
            resolve(true);
          }
        };

        this.sttConnection.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Handle error messages from Deepgram
            if (data.error) {
              console.error('❌ Deepgram API error:', data.error);
              const error = new Error(data.error.message || 'Deepgram API error');
              if (this.onErrorCallback) {
                this.onErrorCallback(error);
              }
              return;
            }
            
            if (data.channel && data.channel.alternatives && data.channel.alternatives.length > 0) {
              const transcript = data.channel.alternatives[0].transcript;
              const isFinal = data.is_final;
              
              if (transcript && this.onTranscriptCallback) {
                this.onTranscriptCallback(transcript, isFinal);
              }
            }
          } catch (error) {
            console.error('❌ Error parsing STT message:', error);
          }
        };

        this.sttConnection.onerror = (error) => {
          console.error('❌ WebSocket error event:', error);
          // Note: WebSocket error event doesn't provide much detail
          // Check onclose for actual error codes
        };

        this.sttConnection.onclose = (event) => {
          clearTimeout(connectionTimeout);
          
          // Deepgram close codes: https://developers.deepgram.com/docs/websocket-errors
          const closeCodes = {
            1000: 'Normal closure',
            1001: 'Going away',
            1006: 'Abnormal closure (no close frame) - Connection refused or network error',
            4004: 'Invalid API key',
            4005: 'Invalid model',
            4006: 'Invalid encoding',
            4007: 'Invalid sample rate',
            4008: 'Invalid language',
            4009: 'Invalid channels',
          };

          const reason = closeCodes[event.code] || `Unknown (code: ${event.code})`;
          console.log(`🔌 WebSocket closed: ${reason}`, {
            code: event.code,
            reason: event.reason || 'No reason provided',
            wasClean: event.wasClean
          });

          if (!isResolved) {
            isResolved = true;
            let error;
            
            if (event.code === 4004) {
              error = new Error('Invalid Deepgram API key (code 4004). Please verify your API key is correct and active at https://console.deepgram.com/');
            } else if (event.code === 1006) {
              // 1006 usually means the connection was refused
              // This can happen if:
              // 1. API key is invalid/expired
              // 2. API key doesn't have WebSocket permissions
              // 3. Network/firewall blocking
              // 4. CORS issues (less likely with WebSockets)
              error = new Error(`Connection refused (code 1006). Possible causes:\n1. Invalid or expired API key\n2. API key lacks WebSocket/STT permissions\n3. Network/firewall blocking the connection\n\nPlease verify your API key at: https://console.deepgram.com/`);
            } else if (event.code !== 1000) {
              error = new Error(`Connection error: ${reason} (code: ${event.code})`);
            } else {
              error = new Error('WebSocket connection closed unexpectedly');
            }
            
            console.error('❌', error.message);
            console.error('💡 Detailed troubleshooting:');
            console.error('   1. Go to https://console.deepgram.com/ and verify your API key');
            console.error('   2. Check API key permissions - ensure WebSocket/STT is enabled');
            console.error('   3. Verify API key format: 40-character hex string');
            console.error('   4. Check browser Network tab → Filter by "WS" → Click the failed connection');
            console.error('   5. Try regenerating your API key if it might be expired');
            
            if (this.onErrorCallback) {
              this.onErrorCallback(error);
            }
            reject(error);
          }
          
          // Reset connection state
          this.sttConnection = null;
          this.isListening = false;
        };
      });
    } catch (error) {
      console.error('❌ Error initializing STT:', error);
      // Cleanup on error
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }
      throw error;
    }
  }

  /**
   * Start listening for speech
   */
  startListening() {
    if (!this.sttConnection) {
      throw new Error('STT connection not initialized. Call initializeSTT first.');
    }
    
    if (this.sttConnection.readyState !== WebSocket.OPEN) {
      throw new Error(`STT connection not ready. Current state: ${this.sttConnection.readyState} (OPEN=1)`);
    }
    
    this.isListening = true;
    console.log('🎤 Started listening for speech...');
  }

  /**
   * Stop listening for speech
   */
  stopListening() {
    this.isListening = false;
  }

  /**
   * Convert Float32 audio to PCM16 format for Deepgram
   */
  convertFloat32ToPCM16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array.buffer;
  }

  /**
   * Close STT connection and cleanup
   */
  async closeSTT() {
    this.isListening = false;
    
    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }

    if (this.sttConnection) {
      this.sttConnection.close();
      this.sttConnection = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = null;
    }
  }


  /**
   * Text-to-Speech using Deepgram TTS API
   */
  async speakText(text, onComplete, onError) {
    if (!this.apiKey) {
      throw new Error('Deepgram API key is not set. Please set REACT_APP_DEEPGRAM_API_KEY in your .env file');
    }

    try {
      const response = await fetch('https://api.deepgram.com/v1/speak?model=aura-asteria-en', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text
        })
      });

      if (!response.ok) {
        throw new Error(`TTS API error: ${response.statusText}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        if (onComplete) onComplete();
      };

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        if (onError) onError(error);
      };

      await audio.play();
      return audio;
    } catch (error) {
      console.error('TTS error:', error);
      if (onError) onError(error);
      throw error;
    }
  }

  /**
   * Stop TTS playback
   */
  stopSpeaking(audioElement) {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  }
}

export default new DeepgramVoiceAgent();

