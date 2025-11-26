import React, { useState } from 'react';
import { BookOpen, Activity, Stethoscope, Pill, Heart, Users, HelpCircle, TrendingUp, ExternalLink, FileText, X } from 'lucide-react';

const ADHDDemo = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BookOpen },
    { key: 'symptoms', label: 'Symptoms', icon: Activity },
    { key: 'diagnosis', label: 'Diagnosis', icon: Stethoscope },
    { key: 'treatment', label: 'Treatment', icon: Pill },
    { key: 'self-help', label: 'Self-Help', icon: Heart },
    { key: 'living-with', label: 'Living With', icon: TrendingUp },
    { key: 'supporters', label: 'For Supporters', icon: Users },
    { key: 'faqs', label: 'FAQs', icon: HelpCircle },
    { key: 'myths', label: 'Myths vs Facts', icon: FileText },
    { key: 'resources', label: 'Resources', icon: ExternalLink }
  ];

  const ageGroups = [
    {
      name: 'Children',
      range: '6-12 years',
      symptoms: [
        {
          category: 'Inattention',
          items: [
            'Difficulty following through on instructions',
            'Trouble organizing tasks and activities',
            'Easily distracted by external stimuli',
            'Forgets daily activities (homework, chores)',
            'Loses things necessary for tasks'
          ]
        },
        {
          category: 'Hyperactivity',
          items: [
            'Fidgets with hands or feet, squirms in seat',
            'Leaves seat when remaining seated is expected',
            'Runs or climbs in inappropriate situations',
            'Unable to play quietly',
            'Often "on the go" or "driven by a motor"'
          ]
        },
        {
          category: 'Impulsivity',
          items: [
            'Blurts out answers before questions completed',
            'Has difficulty waiting their turn',
            'Interrupts or intrudes on others'
          ]
        }
      ]
    },
    {
      name: 'Teens',
      range: '13-25 years',
      symptoms: [
        {
          category: 'Inattention',
          items: [
            'Chronic procrastination with schoolwork',
            'Difficulty managing time and meeting deadlines',
            'Loses track of assignments and appointments',
            'Trouble sustaining attention in lectures',
            'Disorganized notes and living spaces'
          ]
        },
        {
          category: 'Hyperactivity (internalized)',
          items: [
            'Feeling restless or fidgety internally',
            'Internal sense of being always "on"',
            'Difficulty with quiet activities',
            'Prefers constant stimulation'
          ]
        }
      ]
    },
    {
      name: 'Adults',
      range: '26-64 years',
      symptoms: [
        {
          category: 'Inattention',
          items: [
            'Chronic disorganization at home and work',
            'Poor time management and chronic lateness',
            'Difficulty completing projects',
            'Frequent job changes',
            'Relationship challenges from forgetfulness'
          ]
        },
        {
          category: 'Impulsivity',
          items: [
            'Interrupting in meetings',
            'Making hasty decisions',
            'Impatience with slow processes',
            'Difficulty maintaining relationships'
          ]
        }
      ]
    }
  ];

  const myths = [
    {
      myth: "ADHD isn't real / it's made up by pharmaceutical companies",
      fact: "ADHD is recognized by every major medical, psychological, and educational organization worldwide. Brain imaging shows clear structural and functional differences."
    },
    {
      myth: "ADHD is caused by bad parenting or too much screen time",
      fact: "ADHD is neurobiological with strong genetic basis (74% heritable). While parenting doesn't cause ADHD, it affects how well symptoms are managed."
    },
    {
      myth: "People with ADHD just need to try harder",
      fact: "ADHD is a lack of ability to focus consistently, not a lack of effort. The brain functions differently and requires treatment or strategies."
    },
    {
      myth: "ADHD medication is dangerous and leads to drug abuse",
      fact: "When taken as prescribed, stimulant medications are safe with decades of research. Untreated ADHD actually increases substance abuse risk."
    }
  ];

  const faqs = [
    {
      q: "Is ADHD a mental illness?",
      a: "ADHD is classified as a neurodevelopmental disorder. It affects how the brain develops and functions. Some consider it a mental health condition, others neurological. The classification matters less than understanding it's a real medical condition with effective treatments available."
    },
    {
      q: "Is ADHD genetic?",
      a: "Yes, ADHD is highly genetic with a heritability rate of about 74%. If a parent has ADHD, their child has approximately a 50% chance of also having it."
    },
    {
      q: "What's the difference between ADD and ADHD?",
      a: "ADD (Attention Deficit Disorder) is an outdated term. Now it's all called ADHD with three types: Inattentive Type (formerly 'ADD'), Hyperactive-Impulsive Type, and Combined Type."
    },
    {
      q: "Do people with ADHD outgrow it?",
      a: "About 60% of children with ADHD continue to have symptoms in adulthood. Hyperactivity often decreases, but inattention and impulsivity frequently persist."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-900 to-green-800 text-white p-8 rounded-t-xl">
          <h1 className="text-4xl font-bold mb-2">Attention-Deficit/Hyperactivity Disorder</h1>
          <p className="text-green-200">Also known as: ADHD, ADD</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'text-green-600 border-b-2 border-green-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">What is ADHD?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  ADHD (Attention-Deficit/Hyperactivity Disorder) is a neurodevelopmental condition that affects focus, impulse control, and activity levels. It impacts how the brain develops and functions, particularly in areas responsible for attention, organization, and self-regulation.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong className="text-green-900">Prevalence:</strong> ADHD is one of the most common childhood disorders, affecting about 9.8% of children (6 million) and 4.4% of adults (10 million) in the United States.
                </p>
                <div className="bg-white p-4 rounded border border-green-200">
                  <p className="text-gray-700 leading-relaxed">
                    💚 <strong>Important:</strong> ADHD is a real medical condition with biological basis, not a character flaw, lack of discipline, or result of poor parenting. With proper treatment and support, people with ADHD can thrive and lead successful lives.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Take a Self-Assessment</h3>
                <p className="text-blue-800 mb-4">
                  Want to learn more about your symptoms? Take our confidential ADHD screening.
                </p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Take Screening →
                </button>
              </div>
            </div>
          )}

          {/* Symptoms Tab */}
          {activeTab === 'symptoms' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900">Signs & Symptoms</h2>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedAgeGroup('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedAgeGroup === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Ages
                </button>
                {ageGroups.map((group) => (
                  <button
                    key={group.name}
                    onClick={() => setSelectedAgeGroup(group.name)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedAgeGroup === group.name ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {group.name} ({group.range})
                  </button>
                ))}
              </div>

              {ageGroups
                .filter(g => selectedAgeGroup === 'all' || g.name === selectedAgeGroup)
                .map((group) => (
                  <div key={group.name} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {group.name} ({group.range})
                    </h3>
                    <div className="space-y-4">
                      {group.symptoms.map((symptomGroup, idx) => (
                        <div key={idx}>
                          <h4 className="font-semibold text-green-800 mb-2">{symptomGroup.category}</h4>
                          <ul className="space-y-2">
                            {symptomGroup.items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2">
                                <span className="text-green-600 mt-1">•</span>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Treatment Tab */}
          {activeTab === 'treatment' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900">Treatment Options</h2>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-yellow-800">
                  <strong>Effectiveness:</strong> Combined treatment (medication + therapy) is most effective for moderate to severe ADHD. 70-80% show significant improvement with medication.
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full mb-2">
                    MEDICATION
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">Stimulant Medications</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Methylphenidate (Ritalin, Concerta) and amphetamines (Adderall, Vyvanse) increase dopamine and norepinephrine in the brain
                </p>
                <p className="text-sm text-green-700 mb-3">
                  <strong>Effectiveness:</strong> 70-80% of people show significant improvement
                </p>
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">Key Points:</p>
                  <ul className="space-y-1">
                    <li className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      First-line treatment for most people
                    </li>
                    <li className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      Not addictive when taken as prescribed
                    </li>
                    <li className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-600">•</span>
                      May take time to find right medication and dosage
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full mb-2">
                    THERAPY
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">Cognitive Behavioral Therapy (CBT)</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Helps develop coping strategies, organizational skills, and address negative thought patterns
                </p>
                <p className="text-sm text-green-700 mb-3">
                  <strong>Effectiveness:</strong> 50-60% show significant improvement in functioning
                </p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full mb-2">
                    LIFESTYLE
                  </span>
                  <h3 className="text-xl font-bold text-gray-900">Exercise & Sleep</h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Regular physical activity (30+ min daily) and consistent sleep schedule (7-9 hours)
                </p>
                <ul className="space-y-1">
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    Exercise increases dopamine and improves focus
                  </li>
                  <li className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-purple-600">•</span>
                    Poor sleep worsens all ADHD symptoms
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Self-Help Tab */}
          {activeTab === 'self-help' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900">Self-Action Steps</h2>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-4">⚡ Immediate Steps You Can Take</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-green-800">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                    Use phone alarms and reminders for important tasks
                  </li>
                  <li className="flex items-start gap-3 text-green-800">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                    Break large tasks into 15-minute chunks
                  </li>
                  <li className="flex items-start gap-3 text-green-800">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                    Create a distraction-free workspace
                  </li>
                  <li className="flex items-start gap-3 text-green-800">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                    Try the Pomodoro Technique: 25 min work, 5 min break
                  </li>
                  <li className="flex items-start gap-3 text-green-800">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">5</span>
                    Exercise before tasks requiring focus
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* FAQs Tab */}
          {activeTab === 'faqs' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Q: {faq.q}</h3>
                  <p className="text-gray-700 leading-relaxed">
                    <strong>A:</strong> {faq.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Myths Tab */}
          {activeTab === 'myths' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900">Myths vs Facts</h2>
              <p className="text-gray-600">Let's clear up common misconceptions about ADHD.</p>
              {myths.map((item, idx) => (
                <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-red-50 p-6 border-b border-red-200">
                    <p className="text-sm font-semibold text-red-600 mb-2">❌ MYTH</p>
                    <p className="text-gray-900 font-medium">{item.myth}</p>
                  </div>
                  <div className="bg-green-50 p-6">
                    <p className="text-sm font-semibold text-green-600 mb-2">✓ FACT</p>
                    <p className="text-gray-900">{item.fact}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900">Resources & Support</h2>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">🏢 Organizations</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded border border-blue-200">
                    <h4 className="font-semibold text-gray-900">CHADD (Children and Adults with ADHD)</h4>
                    <p className="text-blue-600 text-sm mt-1">https://chadd.org</p>
                    <p className="text-gray-700 text-sm mt-1"><strong>Helpline:</strong> 1-800-233-4050</p>
                  </div>
                  <div className="bg-white p-4 rounded border border-blue-200">
                    <h4 className="font-semibold text-gray-900">ADDA (Attention Deficit Disorder Association)</h4>
                    <p className="text-blue-600 text-sm mt-1">https://add.org</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-3">🆘 Crisis Resources</h3>
                <div className="space-y-2 text-red-800">
                  <p className="font-semibold">If you're in crisis:</p>
                  <p>• 988 Suicide & Crisis Lifeline: Call or text 988</p>
                  <p>• Crisis Text Line: Text HOME to 741741</p>
                  <p>• Emergency: 911</p>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {['diagnosis', 'living-with', 'supporters'].includes(activeTab) && (
            <div className="text-center py-12 animate-fadeIn">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {tabs.find(t => t.key === activeTab)?.label} Section
              </h2>
              <p className="text-gray-600 mb-4">
                This tab contains comprehensive information about {tabs.find(t => t.key === activeTab)?.label.toLowerCase()}.
              </p>
              <p className="text-sm text-gray-500">
                Full content available in the complete implementation.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 rounded-b-xl flex flex-wrap gap-4 justify-between items-center">
          <div className="text-sm text-gray-600">
            <p><strong>Related conditions:</strong> Anxiety, Depression, Learning Disabilities</p>
          </div>
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Take ADHD Screening
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ADHDDemo;