'use client';
import React, { useEffect, useState } from 'react';

interface Connection {
  id: number;
  start: [number, number];
  end: [number, number];
  progress: number;
}

export function WorldMapBackground() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [counter, setCounter] = useState(0);

  const generateRandomPoint = (): [number, number] => {
    // Generate points within the visible area of the map
    return [
      Math.random() * 800, // width
      Math.random() * 400, // height
    ];
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + 1);
      const newConnection: Connection = {
        id: counter,
        start: generateRandomPoint(),
        end: generateRandomPoint(),
        progress: 0,
      };

      setConnections(prev => {
        const updated = [...prev, newConnection].filter(conn => conn.progress < 1);
        return updated.slice(-5); // Keep only the last 5 connections
      });
    }, 2000);

    const animationInterval = setInterval(() => {
      setConnections(prev =>
        prev.map(conn => ({
          ...conn,
          progress: conn.progress + 0.02,
        }))
      );
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, [counter]);

  return (
    <div className="fixed inset-0 z-0 opacity-80 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox="0 0 800 400">
        {/* World map paths - simplified version */}
        <path
          d="M50,100 L150,100 L200,150 L300,120 M350,180 L400,160 L450,180 M500,140 L600,160 L650,140 M700,120 L750,140"
          stroke="#333"
          strokeWidth="0.5"
          fill="none"
        />
        
        {/* Connection lines */}
        {connections.map((conn) => {
          const pathLength = Math.sqrt(
            Math.pow(conn.end[0] - conn.start[0], 2) + 
            Math.pow(conn.end[1] - conn.start[1], 2)
          );
          
          return (
            <g key={conn.id}>
              <line
                x1={conn.start[0]}
                y1={conn.start[1]}
                x2={conn.end[0]}
                y2={conn.end[1]}
                stroke="#4f46e5"
                strokeWidth="1"
                strokeDasharray={pathLength}
                strokeDashoffset={pathLength * (1 - conn.progress)}
                className="connection-line"
              />
              <circle
                cx={conn.start[0]}
                cy={conn.start[1]}
                r="2"
                fill="#4f46e5"
                className="connection-dot"
              />
              <circle
                cx={conn.end[0]}
                cy={conn.end[1]}
                r="2"
                fill="#4f46e5"
                className="connection-dot"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
} 