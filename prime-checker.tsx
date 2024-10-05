import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, ArrowDown, Play } from 'lucide-react';

const Node = ({ id, text, isActive, result, detail }) => (
  <div className={`border-2 rounded-lg p-2 m-2 ${isActive ? 'border-blue-500 bg-blue-100' : 'border-gray-300'}`}>
    <div>{text}</div>
    {detail && <div className="text-sm text-gray-600 mt-1">{detail}</div>}
    {result !== null && (
      <span className={`ml-2 ${result ? 'text-green-500' : 'text-red-500'}`}>
        {result ? <CheckCircle className="inline w-4 h-4" /> : <AlertCircle className="inline w-4 h-4" />}
      </span>
    )}
  </div>
);

const Arrow = () => (
  <div className="flex justify-center my-1">
    <ArrowDown className="w-4 h-4 text-gray-500" />
  </div>
);

const SpeedSlider = ({ speed, setSpeed }) => (
  <div className="flex items-center mb-4">
    <span className="mr-2">Slow</span>
    <input
      type="range"
      min="1"
      max="10"
      value={speed}
      onChange={(e) => setSpeed(parseInt(e.target.value))}
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
    />
    <span className="ml-2">Fast</span>
  </div>
);

const PrimeChecker = () => {
  const [inputNumber, setInputNumber] = useState('');
  const [number, setNumber] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [results, setResults] = useState({});
  const [details, setDetails] = useState({});
  const [speed, setSpeed] = useState(5);
  const [isRunning, setIsRunning] = useState(false);

  const resetState = () => {
    setCurrentStep(null);
    setResults({});
    setDetails({});
    setIsRunning(false);
  };

  const delay = (ms) => new Promise(r => setTimeout(r, ms / speed));

  const runPrimeCheck = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setNumber(parseInt(inputNumber));
    resetState();
  };

  useEffect(() => {
    if (number === null) return;

    const checkPrime = async () => {
      const n = number;
      setCurrentStep('start');
      setDetails({ start: `Checking if ${n} is prime` });
      await delay(1000);

      setCurrentStep('lessThan2');
      setDetails(prev => ({ ...prev, lessThan2: `${n} < 2 = ${n < 2}` }));
      await delay(1000);
      if (n < 2) {
        setResults({ lessThan2: false, final: false });
        setIsRunning(false);
        return;
      }

      setCurrentStep('equals2');
      setDetails(prev => ({ ...prev, equals2: `${n} == 2 = ${n === 2}` }));
      await delay(1000);
      if (n === 2) {
        setResults({ equals2: true, final: true });
        setIsRunning(false);
        return;
      }

      setCurrentStep('isEven');
      setDetails(prev => ({ ...prev, isEven: `${n} % 2 = ${n % 2}` }));
      await delay(1000);
      if (n % 2 === 0) {
        setResults({ isEven: false, final: false });
        setIsRunning(false);
        return;
      }

      setCurrentStep('calcSqrt');
      const sqrt = Math.floor(Math.sqrt(n));
      setDetails(prev => ({ ...prev, calcSqrt: `sqrt(${n}) ≈ ${sqrt}` }));
      await delay(1000);

      setCurrentStep('genPrimes');
      const primes = [];
      for (let i = 3; i <= sqrt; i += 2) {
        if (primes.every(p => i % p !== 0)) primes.push(i);
      }
      setDetails(prev => ({ ...prev, genPrimes: `Primes up to ${sqrt}: ${primes.join(', ')}` }));
      await delay(1000);

      setCurrentStep('checkPrimes');
      let isPrime = true;
      for (let prime of primes) {
        setDetails(prev => ({ ...prev, checkPrimes: `${n} % ${prime} = ${n % prime}` }));
        await delay(500);
        if (n % prime === 0) {
          isPrime = false;
          break;
        }
      }
      setResults({ checkPrimes: isPrime, final: isPrime });
      setIsRunning(false);
    };

    checkPrime();
  }, [number, speed]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex mb-4">
        <input
          type="number"
          value={inputNumber}
          onChange={(e) => setInputNumber(e.target.value)}
          className="flex-grow p-2 border rounded-l"
          placeholder="Enter a number"
        />
        <button
          onClick={runPrimeCheck}
          disabled={isRunning || inputNumber === ''}
          className="flex items-center justify-center px-4 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-gray-300"
        >
          <Play className="w-4 h-4 mr-2" />
          Run
        </button>
      </div>
      <SpeedSlider speed={speed} setSpeed={setSpeed} />
      <div className="flex flex-col items-center">
        <Node id="start" text="Start" isActive={currentStep === 'start'} detail={details.start} />
        <Arrow />
        <Node id="lessThan2" text="Is n < 2?" isActive={currentStep === 'lessThan2'} result={results.lessThan2} detail={details.lessThan2} />
        <Arrow />
        <Node id="equals2" text="Is n == 2?" isActive={currentStep === 'equals2'} result={results.equals2} detail={details.equals2} />
        <Arrow />
        <Node id="isEven" text="Is n even?" isActive={currentStep === 'isEven'} result={results.isEven} detail={details.isEven} />
        <Arrow />
        <Node id="calcSqrt" text="Calculate sqrt(n)" isActive={currentStep === 'calcSqrt'} detail={details.calcSqrt} />
        <Arrow />
        <Node id="genPrimes" text="Generate primes up to sqrt(n)" isActive={currentStep === 'genPrimes'} detail={details.genPrimes} />
        <Arrow />
        <Node id="checkPrimes" text="Check divisibility by primes" isActive={currentStep === 'checkPrimes'} result={results.checkPrimes} detail={details.checkPrimes} />
        <Arrow />
        {results.final !== null && (
          <Node 
            id="final" 
            text={results.final ? "Prime" : "Not Prime"} 
            isActive={true} 
            result={results.final} 
            detail={`${number} is ${results.final ? 'a prime number' : 'not a prime number'}`}
          />
        )}
      </div>
    </div>
  );
};

export default PrimeChecker;
