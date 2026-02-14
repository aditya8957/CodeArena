import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import { motion, AnimatePresence } from 'framer-motion';

const langMap = {
  cpp: 'C++',
  java: 'Java',
  javascript: 'JavaScript'
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;

        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab('result');
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBgColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-400/10 border-green-400/30';
      case 'medium': return 'bg-yellow-400/10 border-yellow-400/30';
      case 'hard': return 'bg-red-400/10 border-red-400/30';
      default: return 'bg-gray-400/10 border-gray-400/30';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-gray-800">
        {/* Left Tabs */}
        <div className="flex bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 px-4">
          {['description', 'editorial', 'solutions', 'submissions', 'chatAI'].map((tab) => (
            <button
              key={tab}
              className={`relative px-4 py-3 text-sm font-medium transition-all ${
                activeLeftTab === tab 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeLeftTab === tab && (
                <motion.div
                  layoutId="leftActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          ))}
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLeftTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeLeftTab === 'description' && (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        {problem.title}
                      </h1>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyBgColor(problem.difficulty)} ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </span>

                     <div className="flex gap-2">
                {(Array.isArray(problem.tags)
                  ? problem.tags
                  : problem.tags
                      .replace(/([a-z])([A-Z])/g, '$1 $2') // safety
                      .split(/[, ]+/)                     // split comma OR space
                ).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>




                    </div>

                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 text-sm leading-relaxed space-y-4">
                        {problem.description.split('\n').map((line, index) => (
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Examples
                      </h3>
                      <div className="space-y-4">
                        {problem.visibleTestCases.map((example, index) => (
                          <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                            <h4 className="font-semibold mb-3 text-gray-300">Example {index + 1}</h4>
                            <div className="space-y-3 text-sm font-mono">
                              <div>
                                <div className="text-gray-400 text-xs mb-1">Input</div>
                                <div className="bg-gray-900/70 px-3 py-2 rounded-lg border border-gray-800">
                                  {example.input}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400 text-xs mb-1">Output</div>
                                <div className="bg-gray-900/70 px-3 py-2 rounded-lg border border-gray-800">
                                  {example.output}
                                </div>
                              </div>
                              {example.explanation && (
                                <div>
                                  <div className="text-gray-400 text-xs mb-1">Explanation</div>
                                  <div className="text-gray-300 px-3 py-2 rounded-lg border border-gray-800">
                                    {example.explanation}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeLeftTab === 'editorial' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Editorial
                    </h2>
                    <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                      <Editorial 
                        secureUrl={problem.secureUrl} 
                        thumbnailUrl={problem.thumbnailUrl} 
                        duration={problem.duration}
                      />
                    </div>
                  </div>
                )}

                {activeLeftTab === 'solutions' && (
                    <div>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Solutions
                      </h2>
                      <div className="space-y-4">
                        {problem.referenceSolution && problem.referenceSolution.length > 0 ? (
                          problem.referenceSolution.map((solution, index) => (
                            <div key={index} className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                              <div className="px-4 py-3 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800">
                                <h3 className="font-semibold">{problem?.title} - {solution?.language}</h3>
                              </div>
                              <div className="p-0">
                                <pre className="text-sm m-0">
                                  <code className="language-javascript block p-4 overflow-x-auto">
                                    {solution?.completeCode}
                                  </code>
                                </pre>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <div className="text-4xl mb-2">📝</div>
                            <p>No solutions available yet. Solutions will be provided by the admin.</p>
                            <p className="text-sm mt-2 text-gray-500">Check back later or contact support.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                 {activeLeftTab === 'submissions' && (
                <div className="min-h-[500px]"> {/* Add minimum height */}
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    My Submissions
                  </h2>
                  <div className="min-h-[400px]"> {/* Add minimum height */}
                    <SubmissionHistory problemId={problemId} />
                  </div>
                </div>
              )}

                {activeLeftTab === 'chatAI' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                      Chat with AI
                    </h2>
                    <div className="bg-gray-900/30 border border-gray-800 rounded-xl overflow-hidden">
                      <ChatAi problem={problem} />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Right Tabs */}
        <div className="flex bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 px-4">
          {['code', 'testcase', 'result'].map((tab) => (
            <button
              key={tab}
              className={`relative px-4 py-3 text-sm font-medium transition-all ${
                activeRightTab === tab 
                  ? 'text-white' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeRightTab === tab && (
                <motion.div
                  layoutId="rightActiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </button>
          ))}
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRightTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col"
            >
              {activeRightTab === 'code' && (
                <div className="flex-1 flex flex-col">
                  {/* Language Selector */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
                    <div className="flex gap-2">
                      {['javascript', 'java', 'cpp'].map((lang) => (
                        <button
                          key={lang}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedLanguage === lang 
                              ? 'bg-white text-black' 
                              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
                          }`}
                          onClick={() => handleLanguageChange(lang)}
                        >
                          {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                        </button>
                      ))}
                    </div>
                  
                  </div>

                  {/* Monaco Editor */}
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      language={getLanguageForMonaco(selectedLanguage)}
                      value={code}
                      onChange={handleEditorChange}
                      onMount={handleEditorDidMount}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        insertSpaces: true,
                        wordWrap: 'on',
                        lineNumbers: 'on',
                        glyphMargin: false,
                        folding: true,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: 'line',
                        selectOnLineNumbers: true,
                        roundedSelection: false,
                        readOnly: false,
                        cursorStyle: 'line',
                        mouseWheelZoom: true,
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-gray-800 bg-gradient-to-r from-gray-900 to-black flex justify-between items-center">
                    <div className="flex gap-2">
                      <button 
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800/50 text-gray-300 hover:bg-gray-700 transition-all"
                        onClick={() => setActiveRightTab('testcase')}
                      >
                        Console
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`px-6 py-2 rounded-lg text-sm font-medium border border-gray-600 hover:border-gray-500 transition-all flex items-center gap-2 ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleRun}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        Run
                      </button>
                      <button
                        className={`px-6 py-2 rounded-lg text-sm font-medium bg-white text-black hover:bg-gray-100 transition-all flex items-center gap-2 ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleSubmitCode}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="w-4 h-4 border-2 border-black border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeRightTab === 'testcase' && (
                <div className="flex-1 p-6 overflow-y-auto">
                  <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Test Results
                  </h3>
                  {runResult ? (
                    <div className={`rounded-xl border ${
                      runResult.success 
                        ? 'border-green-500/30 bg-green-500/5' 
                        : 'border-red-500/30 bg-red-500/5'
                    } p-5`}>
                      {runResult.success ? (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-lg">All test cases passed!</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-900/50 rounded-lg p-3">
                              <div className="text-gray-400 text-xs mb-1">Runtime</div>
                              <div className="text-white font-mono">{runResult.runtime} sec</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-lg p-3">
                              <div className="text-gray-400 text-xs mb-1">Memory</div>
                              <div className="text-white font-mono">{runResult.memory} KB</div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="bg-gray-900/30 rounded-lg p-4 border border-gray-800">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium">Test Case {i + 1}</span>
                                </div>
                                <div className="space-y-2 text-sm font-mono">
                                  <div>
                                    <div className="text-gray-400 text-xs">Input</div>
                                    <div className="text-gray-300 mt-1">{tc.stdin}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400 text-xs">Output</div>
                                    <div className="text-green-400 mt-1">{tc.stdout}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                            <h4 className="font-bold text-lg">Test Cases Failed</h4>
                          </div>
                          <div className="space-y-3">
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className="bg-gray-900/30 rounded-lg p-4 border border-gray-800">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${tc.status_id == 3 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-medium">Test Case {i + 1}</span>
                                  </div>
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${tc.status_id == 3 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {tc.status_id == 3 ? 'Passed' : 'Failed'}
                                  </span>
                                </div>
                                <div className="space-y-2 text-sm font-mono">
                                  <div>
                                    <div className="text-gray-400 text-xs">Input</div>
                                    <div className="text-gray-300 mt-1">{tc.stdin}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400 text-xs">Expected</div>
                                    <div className="text-green-400 mt-1">{tc.expected_output}</div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400 text-xs">Your Output</div>
                                    <div className={`mt-1 ${tc.status_id == 3 ? 'text-green-400' : 'text-red-400'}`}>
                                      {tc.stdout}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-2">▶️</div>
                      <p>Click "Run" to test your code with the example test cases</p>
                    </div>
                  )}
                </div>
              )}

              {activeRightTab === 'result' && (
                <div className="flex-1 p-6 overflow-y-auto">
                  <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Submission Result
                  </h3>
                  {submitResult ? (
                    <div className={`rounded-xl border p-5 ${
                      submitResult.accepted 
                        ? 'border-green-500/30 bg-green-500/5' 
                        : 'border-red-500/30 bg-red-500/5'
                    }`}>
                      {submitResult.accepted ? (
                        <div>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-xl">🎉 Accepted!</h4>
                              <p className="text-gray-400 text-sm">Your solution has been accepted</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-gray-900/50 rounded-lg p-4">
                              <div className="text-gray-400 text-xs mb-1">Test Cases</div>
                              <div className="text-2xl font-bold">
                                {submitResult.passedTestCases}<span className="text-gray-400 text-sm">/{submitResult.totalTestCases}</span>
                              </div>
                            </div>
                            <div className="bg-gray-900/50 rounded-lg p-4">
                              <div className="text-gray-400 text-xs mb-1">Runtime</div>
                              <div className="text-2xl font-bold">{submitResult.runtime}s</div>
                            </div>
                            <div className="bg-gray-900/50 rounded-lg p-4">
                              <div className="text-gray-400 text-xs mb-1">Memory</div>
                              <div className="text-2xl font-bold">{submitResult.memory}KB</div>
                            </div>
                          </div>
                          <div className="text-center">
                            <button
                              onClick={() => setActiveLeftTab('solutions')}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
                            >
                              View Solutions
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-xl">❌ {submitResult.error || 'Wrong Answer'}</h4>
                              <p className="text-gray-400 text-sm">Test Cases: {submitResult.passedTestCases}/{submitResult.totalTestCases} passed</p>
                            </div>
                          </div>
                          <div className="text-center">
                            <button
                              onClick={() => setActiveRightTab('code')}
                              className="px-6 py-3 rounded-lg bg-gradient-to-r from-gray-800 to-black border border-gray-700 text-white font-medium hover:border-gray-600 transition-colors"
                            >
                              Try Again
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-4xl mb-2">📤</div>
                      <p>Click "Submit" to submit your solution for evaluation</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;