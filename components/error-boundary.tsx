"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class EditorialErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Editorial Matrix Failure] ${this.props.name || 'Component'}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="p-12 rounded-[2.5rem] bg-red-500/5 border border-red-500/20 flex flex-col items-center text-center gap-6 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black uppercase tracking-widest text-red-500">Kernel Panic Detection</h3>
            <p className="text-sm text-red-500/60 max-w-sm mx-auto font-medium">
              The {this.props.name || 'component'} encountered a terminal synchronization error. 
              Metadata: {this.state.error?.message || 'Unknown Exception'}
            </p>
          </div>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-3 rounded-xl bg-red-500 text-black font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Re-Initialize System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
