import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { PredictionProvider } from './src/context/PredictionContext';

export default function App() {
  return <PredictionProvider><AppNavigator /></PredictionProvider>;
}