import React, { useState } from 'react';
import { ArrowRight, DollarSign, Car, Users, Wrench } from 'lucide-react';
import { recommendSUV, budgetRanges } from '../data/suvData';

interface QuizStep {
  question: string;
  type: 'single' | 'multiple';
  options: { value: string; label: string; icon?: React.ReactNode }[];
}

const steps: QuizStep[] = [
  {
    question: "What's your budget range?",
    type: 'single',
    options: [
      { value: 'budget', label: 'Budget-Friendly (Under $35,000)', icon: <DollarSign size={24} /> },
      { value: 'midRange', label: 'Mid-Range ($35,001-$50,000)', icon: <DollarSign size={24} /> },
      { value: 'premium', label: 'Premium ($50,001-$75,000)', icon: <DollarSign size={24} /> },
      { value: 'luxury', label: 'Luxury ($75,000+)', icon: <DollarSign size={24} /> }
    ]
  },
  {
    question: 'What will you primarily use the SUV for?',
    type: 'multiple',
    options: [
      { value: 'families', label: 'Family Transport', icon: <Users size={24} /> },
      { value: 'commuting', label: 'Daily Commute', icon: <Car size={24} /> },
      { value: 'off-road', label: 'Off-Road Adventures', icon: <Car size={24} /> },
      { value: 'towing', label: 'Towing/Hauling', icon: <Wrench size={24} /> }
    ]
  },
  {
    question: 'What features are most important to you?',
    type: 'multiple',
    options: [
      { value: 'safety', label: 'Safety Features', icon: <Car size={24} /> },
      { value: 'comfort', label: 'Comfort & Luxury', icon: <Users size={24} /> },
      { value: 'reliability', label: 'Reliability', icon: <Wrench size={24} /> },
      { value: 'fuel-efficiency', label: 'Fuel Efficiency', icon: <Car size={24} /> }
    ]
  }
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    budget: '',
    usage: [] as string[],
    preferences: [] as string[]
  });
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers };
    if (currentStep === 0) {
      newAnswers.budget = value;
    } else if (currentStep === 1) {
      if (!newAnswers.usage.includes(value)) {
        newAnswers.usage = [...newAnswers.usage, value];
      } else {
        newAnswers.usage = newAnswers.usage.filter(v => v !== value);
      }
    } else if (currentStep === 2) {
      if (!newAnswers.preferences.includes(value)) {
        newAnswers.preferences = [...newAnswers.preferences, value];
      } else {
        newAnswers.preferences = newAnswers.preferences.filter(v => v !== value);
      }
    }
    
    setAnswers(newAnswers);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResults(true);
    }
  };

  const recommendations = showResults ? 
    recommendSUV(
      answers.budget as keyof typeof budgetRanges,
      answers.usage,
      answers.preferences
    ) : [];

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Your Perfect SUV Matches</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {recommendations.map(suv => (
            <div key={suv.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
              <img src={suv.imageUrl} alt={suv.model} className="w-full h-48 object-cover" />
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold mb-2">{suv.brand} {suv.model}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>✓ {suv.engine}</p>
                  <p>✓ {suv.fuelEconomy}</p>
                  <p>✓ Seats {suv.seating}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {suv.bestFor.map(feature => (
                    <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">{suv.description}</p>
              </div>
              <div className="p-6 pt-0">
                <a
                  href={suv.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded-lg text-center transition-all transform hover:scale-105 shadow-lg"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            setShowResults(false);
            setCurrentStep(0);
            setAnswers({ budget: '', usage: [], preferences: [] });
          }}
          className="mt-8 mx-auto block px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 mx-1 rounded-full ${
                index <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 text-center">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">{steps[currentStep].question}</h2>

        <div className="grid grid-cols-2 gap-4">
          {steps[currentStep].options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentStep === 0
                  ? answers.budget === option.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                  : currentStep === 1
                  ? answers.usage.includes(option.value)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                  : answers.preferences.includes(option.value)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {option.icon}
                <span className="font-medium text-center">{option.label}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={nextStep}
          disabled={
            (currentStep === 0 && !answers.budget) ||
            (currentStep === 1 && answers.usage.length === 0) ||
            (currentStep === 2 && answers.preferences.length === 0)
          }
          className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'See Recommendations' : 'Next'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}