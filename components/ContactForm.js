import { useState } from 'react';

const ContactForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitStatus('success');
      setIsSubmitting(false);

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitStatus(null);
        onClose();
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(10, 5, 21, 0.8)',
        backdropFilter: 'blur(12px)'
      }}
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="neon-card-rounded">
          <div className="neon-card-rounded-inner p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white uppercase tracking-widest"
                style={{
                  textShadow: '0 2px 6px rgba(0, 0, 0, 0.4), 0 0 10px rgba(0, 200, 255, 0.3)'
                }}>
                Contact Me
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'rgba(255, 255, 255, 0.7)'
                }}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            {submitStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">✓</div>
                <p className="text-lg text-cyan-300 font-medium">Message Sent!</p>
                <p className="text-sm text-gray-400 mt-2">I'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl text-white transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(0, 200, 255, 0.3)',
                      outline: 'none',
                      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 200, 255, 0.6)';
                      e.target.style.boxShadow = '0 0 15px rgba(0, 200, 255, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 200, 255, 0.3)';
                      e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.3)';
                    }}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl text-white transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(0, 200, 255, 0.3)',
                      outline: 'none',
                      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 200, 255, 0.6)';
                      e.target.style.boxShadow = '0 0 15px rgba(0, 200, 255, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 200, 255, 0.3)';
                      e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.3)';
                    }}
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-medium text-cyan-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl text-white transition-all duration-300 resize-none"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(0, 200, 255, 0.3)',
                      outline: 'none',
                      boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.3)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(0, 200, 255, 0.6)';
                      e.target.style.boxShadow = '0 0 15px rgba(0, 200, 255, 0.2), inset 0 1px 3px rgba(0, 0, 0, 0.3)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(0, 200, 255, 0.3)';
                      e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.3)';
                    }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full text-base font-medium transition-all duration-300"
                  style={{
                    background: isSubmitting
                      ? 'rgba(100, 100, 150, 0.3)'
                      : 'linear-gradient(135deg, rgba(0, 200, 255, 0.3), rgba(150, 100, 255, 0.3))',
                    border: '1px solid',
                    borderColor: isSubmitting
                      ? 'rgba(100, 100, 150, 0.4)'
                      : 'rgba(0, 200, 255, 0.5)',
                    color: isSubmitting ? 'rgba(200, 200, 220, 0.6)' : 'white',
                    boxShadow: isSubmitting
                      ? 'none'
                      : '0 0 20px rgba(0, 200, 255, 0.3)',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    backdropFilter: 'blur(12px)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.boxShadow = '0 0 30px rgba(0, 200, 255, 0.5)';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.boxShadow = '0 0 20px rgba(0, 200, 255, 0.3)';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
