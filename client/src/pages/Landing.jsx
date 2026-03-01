import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Landing({ onLogin, onRegister }) {
    return (
        <div className="flex h-screen w-full bg-[#0F172A] overflow-hidden">
            {/* LEFT SIDE */}
            <div className="w-1/2 h-full hidden lg:block">
                <Spline scene="https://prod.spline.design/pillanddnaanimation-qU0rf7pHGYAgMw62TPgjJoRK/scene.splinecode" />
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full lg:w-1/2 h-full bg-white flex items-center justify-center">
                <div className="w-full max-w-sm px-8">
                    {/* Top section */}
                    <div>
                        <h1 className="text-3xl font-bold text-[#0F172A]">🏥 TriageFlow</h1>
                        <p className="text-base text-[#64748B] mt-2">Smart Triage for Smarter Healthcare</p>
                    </div>

                    {/* Feature highlights */}
                    <div className="mt-8 space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-[#0F172A]">✅</span>
                            <span className="text-sm text-[#374151]">Offline-First — Works without internet</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[#0F172A]">✅</span>
                            <span className="text-sm text-[#374151]">Role-Based — Doctors & Nurses</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[#0F172A]">✅</span>
                            <span className="text-sm text-[#374151]">Expert Protocols — Medically verified</span>
                        </div>
                    </div>

                    {/* Divider line */}
                    <div className="border-t border-gray-200 mt-8"></div>

                    {/* Buttons section */}
                    <div className="mt-8 flex flex-col gap-3">
                        <button
                            onClick={onLogin}
                            className="w-full bg-[#0F172A] text-white py-3 rounded-lg font-medium hover:opacity-90 transition"
                        >
                            Login to your Hospital
                        </button>
                        <button
                            onClick={onRegister}
                            className="w-full border-2 border-[#0F172A] text-[#0F172A] py-3 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                            Register your Hospital
                        </button>
                    </div>

                    {/* Bottom text */}
                    <p className="text-xs text-gray-400 text-center mt-8">
                        Trusted by healthcare workers in rural clinics
                    </p>
                </div>
            </div>
        </div>
    );
}
