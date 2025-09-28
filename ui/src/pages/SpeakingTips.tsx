import { BookIcon, BoltIcon, TargetIcon, TimeIcon } from "../icons";

const SpeakingTips = () => {
  const tips = [
    {
      category: "Preparation",
      icon: <TargetIcon className="w-6 h-6 text-brand-500" />,
      tips: [
        "Know your audience and tailor your message accordingly",
        "Practice your opening and closing lines multiple times",
        "Prepare 3-5 key points maximum to avoid overwhelming your audience",
        "Use the PREP method: Point, Reason, Example, Point",
        "Time your speech and practice with a timer"
      ]
    },
    {
      category: "Delivery",
      icon: <BoltIcon className="w-6 h-6 text-orange-500" />,
      tips: [
        "Maintain eye contact with different sections of your audience",
        "Use gestures naturally to emphasize key points",
        "Vary your pace and tone to keep the audience engaged",
        "Pause for effect after important statements",
        "Speak clearly and project your voice to the back of the room"
      ]
    },
    {
      category: "Structure",
      icon: <BookIcon className="w-6 h-6 text-blue-500" />,
      tips: [
        "Start with a strong hook or compelling question",
        "Use the 'Tell them what you're going to tell them' approach",
        "Support each point with evidence or examples",
        "Use transitions between points for smooth flow",
        "End with a memorable conclusion or call to action"
      ]
    },
    {
      category: "Confidence",
      icon: <TimeIcon className="w-6 h-6 text-green-500" />,
      tips: [
        "Practice deep breathing exercises before speaking",
        "Visualize yourself delivering a successful speech",
        "Start with smaller audiences to build confidence",
        "Remember that most people want you to succeed",
        "Focus on your message, not on yourself"
      ]
    }
  ];

  const frameworks = [
    {
      name: "PREP Method",
      description: "Perfect for impromptu speeches and quick responses",
      steps: [
        "Point: State your main argument clearly",
        "Reason: Explain why this point matters",
        "Example: Provide a specific example or story",
        "Point: Restate your main point to reinforce it"
      ],
      color: "orange"
    },
    {
      name: "Problem-Solution-Benefit",
      description: "Ideal for persuasive presentations",
      steps: [
        "Problem: Identify the issue your audience faces",
        "Solution: Present your proposed solution",
        "Benefit: Explain the positive outcomes"
      ],
      color: "blue"
    },
    {
      name: "Past-Present-Future",
      description: "Great for explaining changes or progress",
      steps: [
        "Past: Describe how things used to be",
        "Present: Explain the current situation",
        "Future: Paint a picture of what's to come"
      ],
      color: "green"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookIcon className="w-8 h-8 text-brand-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Speaking Tips
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Master the art of public speaking with proven techniques and frameworks.
        </p>
      </div>

      {/* Tips by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {tips.map((category, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-theme-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-3 mb-4">
              {category.icon}
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {category.category}
              </h2>
            </div>
            <ul className="space-y-3">
              {category.tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-brand-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600 dark:text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Speaking Frameworks */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Speaking Frameworks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {frameworks.map((framework, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-theme-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {framework.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {framework.description}
                </p>
              </div>
              <div className="space-y-2">
                {framework.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full bg-${framework.color}-100 dark:bg-${framework.color}-900/20 flex items-center justify-center flex-shrink-0`}>
                      <span className={`text-xs font-medium text-${framework.color}-700 dark:text-${framework.color}-400`}>
                        {stepIndex + 1}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-500/10 dark:to-blue-500/10 rounded-xl p-8 border border-brand-200 dark:border-brand-500/20">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Reference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Before You Speak
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Practice your opening line</li>
              <li>• Check your technology and setup</li>
              <li>• Arrive early to get comfortable</li>
              <li>• Take deep breaths to calm nerves</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              During Your Speech
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Start strong with a compelling hook</li>
              <li>• Make eye contact with your audience</li>
              <li>• Use pauses for emphasis</li>
              <li>• End with a clear call to action</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingTips;
