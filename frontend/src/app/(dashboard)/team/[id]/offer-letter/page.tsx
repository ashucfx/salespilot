'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Printer, ArrowLeft, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfferLetterPage() {
  const { id } = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await api.get(`/employees/${id}`);
        setEmployee(data?.data || data);
      } catch (err) {
        console.error('Failed to load employee details', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEmployee();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-white">Employee not found</h2>
        <button onClick={() => router.push(`/team/${id}`)} className="mt-4 text-indigo-400">Go Back</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const joiningDate = employee.joiningDate 
    ? new Date(employee.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'TBD';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Action Bar (Hidden in Print) */}
      <div className="print:hidden flex items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-slate-800/60">
        <button 
          onClick={() => router.push(`/team/${id}`)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Profile
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-semibold"
        >
          <Printer className="w-4 h-4" />
          Print Offer Letter
        </button>
      </div>

      {/* Printable Letter Document */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white text-slate-900 p-12 md:p-16 rounded-2xl shadow-xl print:shadow-none print:p-0 min-h-[1056px] relative"
      >
        {/* Header Section */}
        <div className="flex justify-between items-start border-b-2 border-slate-200 pb-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                SALES<span className="text-indigo-600">PILOT</span>
              </span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Ripple Nexus</span>
            </div>
          </div>
          <div className="text-right text-sm text-slate-600">
            <p>123 Innovation Drive</p>
            <p>Tech District, Suite 500</p>
            <p>San Francisco, CA 94107</p>
            <p className="mt-2 text-indigo-600 font-semibold">info@theripplenexus.com</p>
          </div>
        </div>

        {/* Letter Body */}
        <div className="space-y-6 text-[15px] leading-relaxed">
          <p className="font-semibold text-slate-800">Date: {currentDate}</p>
          
          <div>
            <p className="font-bold text-lg">{employee.firstName} {employee.lastName}</p>
            <p>{employee.personalEmail || employee.email}</p>
            {employee.phone && <p>{employee.phone}</p>}
          </div>

          <p className="font-bold text-lg mt-8">Subject: Offer of Employment</p>

          <p>Dear {employee.firstName},</p>

          <p>
            We are thrilled to offer you a position at <strong>SalesPilot (Ripple Nexus)</strong>. 
            Based on your experience, skills, and background, we are confident that you will be a valuable addition to our enterprise revenue engine.
          </p>

          <p>
            This letter outlines the core terms and conditions of your employment with us:
          </p>

          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 my-6">
            <ul className="space-y-3 list-none">
              <li className="flex gap-4"><span className="w-40 font-semibold text-slate-700">Designation:</span> <span className="font-bold text-slate-900">{employee.designation || 'Sales Executive'}</span></li>
              <li className="flex gap-4"><span className="w-40 font-semibold text-slate-700">Joining Date:</span> <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 rounded">{joiningDate}</span></li>
              <li className="flex gap-4"><span className="w-40 font-semibold text-slate-700">Base Salary:</span> <span className="font-bold text-slate-900">${employee.salary?.toLocaleString() || 'N/A'} per annum</span></li>
              <li className="flex gap-4"><span className="w-40 font-semibold text-slate-700">Commission Rate:</span> <span className="font-bold text-slate-900">{employee.commissionRate || 10}%</span></li>
              <li className="flex gap-4"><span className="w-40 font-semibold text-slate-700">Employment Type:</span> <span className="font-bold text-slate-900">Full-Time</span></li>
            </ul>
          </div>

          <p>
            <strong>Performance Incentives:</strong> As part of the sales team, you are eligible to earn a 
            {employee.commissionRate || 10}% commission on closed-won revenue, calculated and paid out according to the standard SalesPilot schedule.
          </p>

          <p>
            <strong>Benefits & Onboarding:</strong> Your employment will be subject to the company's standard policies. 
            On your first day, please ensure your KYC documents are uploaded to the portal for official verification.
          </p>

          <p>
            We look forward to welcoming you to the SalesPilot family and achieving incredible milestones together. 
            Please sign below to indicate your acceptance of this offer.
          </p>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 mt-16 pt-8">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-8">For SalesPilot (Ripple Nexus):</p>
              <div className="border-b-2 border-slate-300 w-full mb-2"></div>
              <p className="font-bold text-slate-800">Ashutosh Shukla</p>
              <p className="text-sm text-slate-500">Chief Executive Officer</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-8">Accepted By Employee:</p>
              <div className="border-b-2 border-slate-300 w-full mb-2"></div>
              <p className="font-bold text-slate-800">{employee.firstName} {employee.lastName}</p>
              <p className="text-sm text-slate-500">Date: _______________</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
