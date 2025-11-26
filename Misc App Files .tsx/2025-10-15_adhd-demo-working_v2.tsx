import React, { useState } from 'react';
import { BookOpen, Activity, Stethoscope, Pill, Heart, Users, HelpCircle, TrendingUp, ExternalLink, FileText } from 'lucide-react';

export default function PMAction() {
  const [selectedCondition, setSelectedCondition] = useState('adhd');
  const [activeTab, setActiveTab] = useState('overview');

  const conditions = [
    { id: 'adhd', name: 'ADHD', color: 'green' },
    { id: 'depression', name: 'Depression', color: 'blue' },
    { id: 'anxiety', name: 'Anxiety', color: 'yellow' },
    { id: 'ptsd', name: 'PTSD', color: 'red' },
    { id: 'autism', name: 'Autism', color: 'purple' },
    { id: 'bipolar', name: 'Bipolar', color: 'indigo' }
  ];

  const conditionData = {
    adhd: {
      name: 'Attention-Deficit/Hyperactivity Disorder',
      alias: 'Also known as: ADHD, ADD',
      color: 'green',
      overview: 'ADHD is a neurodevelopmental condition that affects focus, impulse control, and activity levels. Affecting about 9.8% of children and 4.4% of adults.',
      symptoms: ['Lost interest', 'Feel down', 'Sleep problems', 'Trouble organizing', 'Restless'],
      treatments: ['Stimulant medications (70-80% effective)', 'Cognitive Behavioral Therapy', 'Exercise & Sleep routines']
    },
    depression: {
      name: 'Major Depressive Disorder',
      alias: 'Also known as: Depression, MDD',
      color: 'blue',
      overview: 'Depression is a mood disorder characterized by persistent sadness, loss of interest, and difficulty functioning. Affects about 8% of adults.',
      symptoms: ['Persistent sadness', 'Loss of interest', 'Sleep changes', 'Fatigue', 'Worthlessness'],
      treatments: ['Antidepressant medications (60-70% effective)', 'Psychotherapy (CBT, IPT)', 'Lifestyle changes & exercise']
    },
    anxiety: {
      name: 'Generalized Anxiety Disorder',
      alias: 'Also known as: Anxiety, GAD',
      color: 'yellow',
      overview: 'Anxiety disorders involve persistent worry and fear that interferes with daily activities. Affects about 6.8% of adults.',
      symptoms: ['Excessive worry', 'Physical tension', 'Sleep problems', 'Restlessness', 'Concentration difficulties'],
      treatments: ['Anti-anxiety medications', 'Cognitive Behavioral Therapy', 'Relaxation techniques & mindfulness']
    },
    ptsd: {
      name: 'Post-Traumatic Stress Disorder',
      alias: 'Also known as: PTSD, Trauma',
      color: 'red',
      overview: 'PTSD develops after exposure to a traumatic event. Involves intrusive memories, avoidance, and hyperarousal. Affects about 3.6% of adults.',
      symptoms: ['Intrusive memories', 'Nightmares', 'Avoidance behaviors', 'Hypervigilance', 'Emotional numbness'],
      treatments: ['Trauma-focused CBT', 'EMDR therapy', 'Medication & support groups']
    },
    autism: {
      name: 'Autism Spectrum Disorder',
      alias: 'Also known as: Autism, ASD',
      color: 'purple',
      overview: 'Autism is a neurodevelopmental difference affecting social communication and behavior. Presents across a spectrum with varying support needs.',
      symptoms: ['Social communication differences', 'Restricted interests', 'Sensory sensitivities', 'Preference for routines', 'Stimming behaviors'],
      treatments: ['Behavioral therapy', 'Speech & occupational therapy', 'Sensory accommodations']
    },
    bipolar: {
      name: 'Bipolar Disorder',
      alias: 'Also known as: Bipolar, BD',
      color: 'indigo',
      overview: 'Bipolar disorder involves cycling between depressive and manic/hypomanic episodes. Affects about 2.8% of adults.',
      symptoms: ['Manic episodes', 'Depressive episodes', 'Racing thoughts', 'Impulsivity', 'Sleep changes'],
      treatments: ['Mood stabilizers (Lithium, Valproate)', 'Antipsychotics', 'Psychotherapy & lifestyle management']
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BookOpen },
    { key: 'symptoms', label: 'Symptoms', icon: Activity },
    { key: 'treatment', label: 'Treatment', icon: Pill },
    { key: 'self-help', label: 'Self-Help', icon: Heart },
    { key: 'resources', label: 'Resources', icon: ExternalLink }
  ];

  const current = conditionData[selectedCondition];
  const colorMap = {
    green: 'from-green-900 to-green-800',
    blue: 'from-blue-900 to-blue-800',
    yellow: 'from-yellow-900 to-yellow-800',
    red: 'from-red-900 to-red-800',
    purple: 'from-purple-900 to-purple-800',
    indigo: 'from-indigo-900 to-indigo-800'
  };

  const colorBorder = {
    green: 'border-green-600',
    blue: 'border-blue-600',
    yellow: 'border-yellow-400',
    red: 'border-red-600',
    purple: 'border-purple-600',
    indigo: 'border-indigo-600'
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${colorMap[current.color]} text-white p-8 rounded-t-xl`}>
          <h1 className="text-4xl font-bold mb-2">{current.name}</h1>
          <p className="opacity-90">{current.alias}</p>
        </div>

        {/* Condition Selector */}
        <div className="border-b bg-gray-50 p-4">
          <p className="text-sm text-gray-600 mb-3">Browse other conditions:</p>
          <div className="flex flex-wrap gap-2">
            {conditions.map(cond => (
              <button
                key={cond.id}
                onClick={() => {
                  setSelectedCondition(cond.id);
                  setActiveTab('overview');
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCondition === cond.id
                    ? `bg-${cond.color}-600 text-white`
                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >
                {cond.name}
              </button>
            ))}
          </div>
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
                      ? `text-${current.color}-600 border-b-2 border-${current.color}-600 bg-white`
                      : 'text-gray-600 hover:text-gray-900'
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className={`bg-${current.color}-50 border-l-4 ${colorBorder[current.color]} p-6 rounded`}>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">What is {current.name}?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{current.overview}</p>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="text-gray-700">
                    <strong>Important:</strong> This is a real medical condition with biological basis. With proper treatment and support, people can thrive and lead successful lives.
                  </p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700">
                Take Screening →
              </button>
            </div>
          )}

          {activeTab === 'symptoms' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Signs & Symptoms</h2>
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
                <ul className="space-y-3">
                  {current.symptoms.map((symptom, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className={`text-${current.color}-600 mt-1`}>•</span>
                      <span className="text-gray-700">{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-gray-600">
                If you experience several of these symptoms persistently, consider speaking with a healthcare provider for proper evaluation.
              </p>
            </div>
          )}

          {activeTab === 'treatment' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Treatment Options</h2>
              {current.treatments.map((treatment, idx) => (
                <div key={idx} className="bg-white border-2 border-gray-200 rounded-lg p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{treatment}</h3>
                  <p className="text-gray-700 text-sm">
                    Combined approaches (medication + therapy) are often most effective. Treatment should be personalized to your needs.
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'self-help' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Self-Help Strategies</h2>
              <div className={`bg-${current.color}-50 p-6 rounded-lg`}>
                <h3 className="text-lg font-semibold mb-4">Immediate Steps</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-800">
                    <span className={`flex-shrink-0 w-6 h-6 bg-${current.color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold`}>1</span>
                    Establish a consistent daily routine
                  </li>
                  <li className="flex items-start gap-3 text-gray-800">
                    <span className={`flex-shrink-0 w-6 h-6 bg-${current.color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold`}>2</span>
                    Practice regular exercise and good sleep habits
                  </li>
                  <li className="flex items-start gap-3 text-gray-800">
                    <span className={`flex-shrink-0 w-6 h-6 bg-${current.color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold`}>3</span>
                    Connect with supportive friends or family
                  </li>
                  <li className="flex items-start gap-3 text-gray-800">
                    <span className={`flex-shrink-0 w-6 h-6 bg-${current.color}-600 text-white rounded-full flex items-center justify-center text-sm font-bold`}>4</span>
                    Practice mindfulness or relaxation techniques
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Resources & Support</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Support Organizations</h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded border border-blue-200">
                    <h4 className="font-semibold text-gray-900">National Mental Health Organizations</h4>
                    <p className="text-blue-600 text-sm mt-2">NAMI: 1-800-950-NAMI (6264)</p>
                    <p className="text-gray-600 text-sm">Mental Health America: mhanational.org</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-3">Crisis Resources</h3>
                <div className="space-y-2 text-red-800">
                  <p className="font-semibold">If you're in crisis:</p>
                  <p>• 988 Suicide & Crisis Lifeline: Call or text 988</p>
                  <p>• Crisis Text Line: Text HOME to 741741</p>
                  <p>• Emergency: 911</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-6 rounded-b-xl">
          <button className={`bg-${current.color}-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-${current.color}-700`}>
            Take {current.name} Screening
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}