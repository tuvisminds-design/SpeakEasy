import { BookIcon, BoltIcon, TargetIcon, TimeIcon, LightbulbIcon, BodyLanguageIcon, Volume2Icon, UsersIcon, HeartIcon, ClockIcon } from "../icons";

const SpeakingTips = () => {
  const tips = [
    {
      category: "Body Language",
      icon: <BodyLanguageIcon className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-100",
      badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
      tips: [
        "Maintain eye contact with different sections of your audience",
        "Use open gestures and avoid crossing your arms",
        "Stand tall with shoulders back to project confidence",
        "Move purposefully - avoid pacing or swaying"
      ]
    },
    {
      category: "Voice & Delivery",
      icon: <Volume2Icon className="w-5 h-5 text-green-600" />,
      iconBg: "bg-green-100",
      badgeColor: "bg-green-100 text-green-800 border-green-200",
      tips: [
        "Speak slower than you think you should",
        "Vary your tone to maintain interest",
        "Use strategic pauses for emphasis",
        "Project your voice to the back of the room"
      ]
    },
    {
      category: "Audience Engagement",
      icon: <UsersIcon className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-100",
      badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
      tips: [
        "Start with a compelling hook or question",
        "Tell stories to make your points memorable",
        "Ask rhetorical questions to involve your audience",
        "Use 'you' language to create connection"
      ]
    },
    {
      category: "Managing Nerves",
      icon: <HeartIcon className="w-5 h-5 text-red-600" />,
      iconBg: "bg-red-100",
      badgeColor: "bg-red-100 text-red-800 border-red-200",
      tips: [
        "Practice deep breathing before speaking",
        "Visualize success before your presentation",
        "Remember that nerves are normal and can be helpful",
        "Focus on your message, not your anxiety"
      ]
    },
    {
      category: "Time Management",
      icon: <ClockIcon className="w-5 h-5 text-orange-600" />,
      iconBg: "bg-orange-100",
      badgeColor: "bg-orange-100 text-orange-800 border-orange-200",
      tips: [
        "Practice with a timer to know your actual speaking pace",
        "Build in buffer time for audience interaction",
        "Have a clear structure with distinct sections",
        "Prepare a shorter version if you run long"
      ]
    },
    {
      category: "Content Structure",
      icon: <TargetIcon className="w-5 h-5 text-teal-600" />,
      iconBg: "bg-teal-100",
      badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
      tips: [
        "Follow the 'Tell them' rule: Tell them what you'll say, say it, tell them what you said",
        "Limit main points to 3-5 for better retention",
        "Use transitions to guide your audience through your speech",
        "End with a clear call to action or memorable statement"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
              <LightbulbIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Speaking Tips
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Master the art of public speaking with these proven techniques and best practices
          </p>
        </div>

        {/* Tips by Category */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tips.map((category, index) => (
            <div
              key={index}
              className="rounded-lg bg-card text-card-foreground glass-effect border-0 shadow-lg h-full hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col space-y-1.5 p-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.iconBg}`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="tracking-tight text-xl font-semibold text-slate-900">
                      {category.category}
                    </h3>
                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-secondary/80 text-xs mt-1 ${category.badgeColor}`}>
                      {category.tips.length} tips
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0">
                <div className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <div key={tipIndex} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BoltIcon className="w-3 h-3 text-slate-600" />
                      </div>
                      <p className="text-slate-700 leading-relaxed text-sm">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip Section */}
        <div className="mt-8">
          <div className="rounded-lg bg-card text-card-foreground glass-effect border-0 shadow-lg bg-gradient-to-r from-teal-50 to-blue-50">
            <div className="p-6">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
                  <BoltIcon className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-semibold text-slate-900">Pro Tip</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Practice Makes Progress</h3>
                <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  The best way to improve your public speaking skills is through regular practice. Start with small audiences, record yourself to identify areas for improvement, and gradually challenge yourself with larger groups and more complex topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingTips;
