'use client';

import { useState, useEffect } from 'react';

// Haptic feedback utilities as per Phase 1 specifications
export interface HapticFeedbackOptions {
  pattern?: number | number[];
  duration?: number;
  intensity?: 'light' | 'medium' | 'heavy';
}

export class HapticFeedback {
  static isSupported(): boolean {
    return 'vibrate' in navigator || 'hapticFeedback' in navigator;
  }

  private static getPattern(type: 'light' | 'medium' | 'heavy'): number | number[] {
    const patterns = {
      light: 10,
      medium: [50, 50, 50],
      heavy: [100, 30, 100, 30, 100]
    };
    return patterns[type] || patterns.light;
  }

  // Basic haptic feedback for button presses
  static buttonPress(intensity: 'light' | 'medium' | 'heavy' = 'light'): void {
    if (!this.isSupported()) return;

    try {
      const pattern = this.getPattern(intensity);
      navigator.vibrate(pattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
    }
  }

  // Success haptic feedback
  static success(): void {
    if (!this.isSupported()) return;

    try {
      // Double tap pattern for success
      navigator.vibrate([50, 50, 50]);
    } catch (error) {
      console.warn('Success haptic feedback failed:', error);
    }
  }

  // Error haptic feedback
  static error(): void {
    if (!this.isSupported()) return;

    try {
      // Long vibration for error
      navigator.vibrate([200, 100, 200]);
    } catch (error) {
      console.warn('Error haptic feedback failed:', error);
    }
  }

  // Warning haptic feedback
  static warning(): void {
    if (!this.isSupported()) return;

    try {
      // Medium intensity warning
      navigator.vibrate([100, 50, 100]);
    } catch (error) {
      console.warn('Warning haptic feedback failed:', error);
    }
  }

  // Navigation haptic feedback
  static navigation(): void {
    if (!this.isSupported()) return;

    try {
      // Light tap for navigation
      navigator.vibrate(15);
    } catch (error) {
      console.warn('Navigation haptic feedback failed:', error);
    }
  }

  // Selection haptic feedback
  static selection(): void {
    if (!this.isSupported()) return;

    try {
      // Quick tap for selection
      navigator.vibrate(20);
    } catch (error) {
      console.warn('Selection haptic feedback failed:', error);
    }
  }

  // Notification haptic feedback
  static notification(): void {
    if (!this.isSupported()) return;

    try {
      // Distinctive pattern for notifications
      navigator.vibrate([50, 50, 50, 50, 100]);
    } catch (error) {
      console.warn('Notification haptic feedback failed:', error);
    }
  }

  // Custom haptic feedback
  static custom(options: HapticFeedbackOptions): void {
    if (!this.isSupported()) return;

    try {
      if (options.pattern) {
        navigator.vibrate(options.pattern);
      } else if (options.duration) {
        navigator.vibrate(options.duration);
      } else if (options.intensity) {
        const pattern = this.getPattern(options.intensity);
        navigator.vibrate(pattern);
      }
    } catch (error) {
      console.warn('Custom haptic feedback failed:', error);
    }
  }

  // Stop all haptic feedback
  static stop(): void {
    if (!this.isSupported()) return;

    try {
      navigator.vibrate(0);
    } catch (error) {
      console.warn('Stop haptic feedback failed:', error);
    }
  }

  // Check if haptic feedback is enabled in user preferences
  static isEnabled(): boolean {
    if (typeof window !== 'undefined') {
      const preference = localStorage.getItem('finsight-haptic-enabled');
      return preference !== 'false'; // Default to enabled
    }
    return true;
  }

  // Enable/disable haptic feedback
  static setEnabled(enabled: boolean): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('finsight-haptic-enabled', enabled.toString());
    }
  }

  // Conditional haptic feedback that respects user preferences
  static trigger(
    type: 'button' | 'success' | 'error' | 'warning' | 'navigation' | 'selection' | 'notification',
    intensity?: 'light' | 'medium' | 'heavy'
  ): void {
    if (!this.isEnabled()) return;

    switch (type) {
      case 'button':
        this.buttonPress(intensity);
        break;
      case 'success':
        this.success();
        break;
      case 'error':
        this.error();
        break;
      case 'warning':
        this.warning();
        break;
      case 'navigation':
        this.navigation();
        break;
      case 'selection':
        this.selection();
        break;
      case 'notification':
        this.notification();
        break;
    }
  }
}

// React hook for haptic feedback
export const useHapticFeedback = () => {
  return {
    buttonPress: (intensity?: 'light' | 'medium' | 'heavy') => HapticFeedback.buttonPress(intensity),
    success: () => HapticFeedback.success(),
    error: () => HapticFeedback.error(),
    warning: () => HapticFeedback.warning(),
    navigation: () => HapticFeedback.navigation(),
    selection: () => HapticFeedback.selection(),
    notification: () => HapticFeedback.notification(),
    custom: (options: HapticFeedbackOptions) => HapticFeedback.custom(options),
    stop: () => HapticFeedback.stop(),
    trigger: (type: 'button' | 'success' | 'error' | 'warning' | 'navigation' | 'selection' | 'notification', intensity?: 'light' | 'medium' | 'heavy') => 
      HapticFeedback.trigger(type, intensity),
    isSupported: () => HapticFeedback.isSupported(),
    isEnabled: () => HapticFeedback.isEnabled(),
    setEnabled: (enabled: boolean) => HapticFeedback.setEnabled(enabled)
  };
};

export default HapticFeedback;
