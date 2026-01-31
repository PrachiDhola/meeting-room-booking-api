const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-auto">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              <span className="gradient-text bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                MeetingRoom
              </span>
            </h3>
            <p className="text-gray-400">
              Book professional meeting rooms in seconds. Modern spaces for productive collaboration.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/rooms" className="hover:text-white transition-colors">Browse Rooms</a></li>
              <li><a href="/register" className="hover:text-white transition-colors">Sign Up</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-gray-400">
              Need help? Contact our support team.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2026 Meeting Room Booking System. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
