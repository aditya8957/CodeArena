import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Help() {
  const [openFaq, setOpenFaq] = useState(null);
  const [bubbles, setBubbles] = useState([]);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "How do I submit a solution to a problem?",
      answer: "Navigate to any problem page, write your code in the editor, select your programming language, and click the 'Submit' button. Your code will be tested against hidden test cases and you'll receive instant feedback."
    },
    {
      id: 2,
      question: "What programming languages are supported?",
      answer: "We currently support JavaScript, Python, Java, and C++. Support for additional languages is planned for future updates."
    },
    {
      id: 3,
      question: "Is CodeArena completely free?",
      answer: "Yes! CodeArena is completely free to use. We believe in making coding education accessible to everyone."
    },
    {
      id: 4,
      question: "How are problems organized?",
      answer: "Problems are categorized by difficulty (Easy, Medium, Hard) and tagged with relevant topics like Arrays, Dynamic Programming, Trees, etc. You can filter problems based on your preferences."
    },
    {
      id: 5,
      question: "Can I track my progress?",
      answer: "Yes! Your profile shows problems solved, submission history, and statistics. You can also see your global ranking on the leaderboard."
    },
    {
      id: 6,
      question: "What happens if my code fails?",
      answer: "You'll receive detailed feedback including which test cases failed, error messages, and suggestions for improvement. You can resubmit as many times as needed."
    },
    {
      id: 7,
      question: "Are there any contests or competitions?",
      answer: "Yes! We host regular coding contests with varying difficulty levels. Check the Contests page for upcoming events and participate to improve your skills and climb the leaderboard."
    },
    {
      id: 8,
      question: "How do I report a bug or issue?",
      answer: "You can use the contact form below to report any bugs or issues you encounter. Please include details about the problem and steps to reproduce it."
    }
  ];

  // Contact information
  const contacts = [
    {
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 0 002 2z" />
        </svg>
      ),
      type: "Email",
      value: "adityapratap8957@gmail.com",
      link: "mailto:adityapratap8957@gmail.com"
    },
    {
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      type: "GitHub",
      value: "github.com/aditya8957",
      link: "https://github.com/aditya8957"
    },
    {
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      ),
      type: "LinkedIn",
      value: "Aditya Pratap",
      link: "https://www.linkedin.com/in/aditya-pratap-9a768632a/"
    },
    {
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      type: "Location",
      value: "Delhi, India"
    }
  ];

  // Generate floating bubbles
  useEffect(() => {
    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 10,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 20,
      opacity: Math.random() * 0.15 + 0.05
    }));
    setBubbles(newBubbles);
  }, []);

  const handleFaqToggle = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', contactForm);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full border border-white/10 bg-white/5"
          style={{
            width: bubble.size,
            height: bubble.size,
            left: `${bubble.left}%`,
            top: '-50px',
            opacity: bubble.opacity
          }}
          animate={{
            y: [0, window.innerHeight + 100],
            x: [0, Math.sin(bubble.id) * 30]
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Help & Support</h1>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Find answers to common questions or get in touch with our support team
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - FAQ */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div 
                    key={faq.id}
                    className="border border-gray-800 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => handleFaqToggle(faq.id)}
                      className="w-full text-left p-4 bg-gray-900/50 hover:bg-gray-800/50 transition-colors flex justify-between items-center"
                    >
                      <span className="text-white font-medium pr-4">{faq.question}</span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${
                          openFaq === faq.id ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    <AnimatePresence>
                      {openFaq === faq.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-gray-800"
                        >
                          <div className="p-4">
                            <p className="text-gray-300">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Contact */}
          <div className="space-y-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                
                <input
                  type="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  placeholder="Your Email"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                
                <input
                  type="text"
                  name="subject"
                  value={contactForm.subject}
                  onChange={handleContactChange}
                  placeholder="Subject"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                
                <textarea
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  placeholder="Your Message"
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-900/30 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                      {contact.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">{contact.type}</div>
                      {contact.link ? (
                        <a 
                          href={contact.link}
                          target={contact.link.startsWith('http') ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="text-white hover:text-indigo-400 transition-colors"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <div className="text-white">{contact.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Quick Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <div className="text-indigo-400 font-bold text-lg mb-3">💡 Start Easy</div>
              <p className="text-gray-300">Begin with easy problems to build confidence before tackling medium and hard challenges.</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6">
              <div className="text-indigo-400 font-bold text-lg mb-3">📚 Read Solutions</div>
              <p className="text-gray-300">Learn from others by reading solution discussions and understanding different approaches.</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-6">
              <div className="text-indigo-400 font-bold text-lg mb-3">⏱️ Time Yourself</div>
              <p className="text-gray-300">Practice solving problems within time limits to prepare for coding interviews.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Help;