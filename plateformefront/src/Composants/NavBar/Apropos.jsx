"use client";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", form);
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex items-center justify-between gap-12">
        
        {/* Illustration gauche */}
        <div className="hidden lg:flex flex-1 justify-end">
          <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none">
            {/* Personnage 1 */}
            <circle cx="80" cy="60" r="15" fill="#FF6B6B"/>
            <rect x="65" y="75" width="30" height="45" rx="3" fill="#FFFFFF"/>
            <rect x="65" y="75" width="30" height="20" rx="3" fill="#FF6B6B"/>
            <rect x="70" y="120" width="8" height="35" rx="4" fill="#4ECDC4"/>
            <rect x="87" y="120" width="8" height="35" rx="4" fill="#4ECDC4"/>
            <line x1="65" y1="85" x2="50" y2="95" stroke="#FFE5B4" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="45" cy="95" r="8" fill="#FF6B6B"/>
            
            {/* Personnage 2 */}
            <circle cx="120" cy="65" r="12" fill="#4ECDC4"/>
            <rect x="108" y="77" width="24" height="38" rx="3" fill="#4ECDC4"/>
            <rect x="113" y="115" width="6" height="30" rx="3" fill="#FFFFFF"/>
            <rect x="125" y="115" width="6" height="30" rx="3" fill="#FFFFFF"/>
            <line x1="132" y1="85" x2="145" y2="75" stroke="#FFE5B4" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="148" cy="72" r="6" fill="#FF6B6B"/>
          </svg>
        </div>

        {/* Formulaire central */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-[#FF6B6B] mb-4">gusto</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Welcome back to Gusto.
            </h2>
            <p className="text-sm text-gray-600">
              New here?{" "}
              <a href="/signup" className="text-[#00A699] hover:underline font-medium">
                Create an account
              </a>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg 
                         focus:border-[#00A699] focus:outline-none transition-colors
                         text-gray-800"
                placeholder="vous@exemple.com"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-[#00A699] hover:underline font-medium"
                >
                  Forgot your password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg 
                         focus:border-[#00A699] focus:outline-none transition-colors
                         text-gray-800"
                placeholder="••••••••"
              />
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                checked={form.remember}
                onChange={handleChange}
                className="w-4 h-4 text-[#00A699] border-gray-300 rounded 
                         focus:ring-[#00A699] focus:ring-2"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                Remember this device
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-[#00A699] text-white py-3 px-4 rounded-lg 
                       font-semibold text-base hover:bg-[#008C82] 
                       transition-colors shadow-lg hover:shadow-xl"
            >
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or sign in with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => handleSocialLogin("Google")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 
                       border-2 border-gray-300 rounded-lg hover:bg-gray-50 
                       transition-colors font-medium text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* Xero and Intuit side by side */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin("Xero")}
                className="flex items-center justify-center gap-2 px-4 py-3 
                         border-2 border-gray-300 rounded-lg hover:bg-gray-50 
                         transition-colors font-medium text-gray-700"
              >
                <div className="w-5 h-5 bg-[#13B5EA] rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">X</span>
                </div>
                <span>Xero</span>
              </button>

              <button
                onClick={() => handleSocialLogin("Intuit")}
                className="flex items-center justify-center gap-2 px-4 py-3 
                         border-2 border-gray-300 rounded-lg hover:bg-gray-50 
                         transition-colors font-medium text-gray-700"
              >
                <div className="w-5 h-5 bg-[#393A96] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <span>Intuit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Illustration droite */}
        <div className="hidden lg:flex flex-1">
          <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none">
            {/* Personnage 3 */}
            <circle cx="70" cy="70" r="14" fill="#95E1D3"/>
            <rect x="56" y="84" width="28" height="42" rx="3" fill="#FFFFFF"/>
            <rect x="56" y="84" width="28" height="18" rx="3" fill="#4ECDC4"/>
            <rect x="61" y="126" width="7" height="32" rx="3" fill="#95E1D3"/>
            <rect x="77" y="126" width="7" height="32" rx="3" fill="#95E1D3"/>
            <line x1="84" y1="92" x2="98" y2="85" stroke="#FFE5B4" strokeWidth="4" strokeLinecap="round"/>
            
            {/* Personnage 4 */}
            <circle cx="130" cy="85" r="13" fill="#FFE5B4"/>
            <rect x="117" y="98" width="26" height="40" rx="3" fill="#FF6B6B"/>
            <rect x="117" y="98" width="26" height="18" rx="3" fill="#FFFFFF"/>
            <line x1="133" y1="138" x2="133" y2="165" stroke="#4ECDC4" strokeWidth="7" strokeLinecap="round"/>
            <line x1="117" y1="108" x2="105" y2="118" stroke="#FFE5B4" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="102" cy="122" r="5" fill="#FF6B6B"/>
          </svg>
        </div>
      </div>
    </div>
  );
}