import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparklesIcon } from 'lucide-react';

// Create a 3D Extruded "A" + House Roof Logo Mesh using THREE.Shape
function ALogoMesh({ mouse, isHovered, size = 1 }) {
  const meshRef = useRef();

  // Create stylized "A" + Roof Shape path
  const shape = React.useMemo(() => {
    const s = new THREE.Shape();
    // Outer "A" / Roof outline
    s.moveTo(0, 1.4);       // Top apex peak
    s.lineTo(1.1, -1.2);    // Right leg
    s.lineTo(0.65, -1.2);   // Right inner foot
    s.lineTo(0.4, -0.6);    // Right bar inner
    s.lineTo(-0.4, -0.6);   // Left bar inner
    s.lineTo(-0.65, -1.2);  // Left inner foot
    s.lineTo(-1.1, -1.2);   // Left leg
    s.closePath();

    // Triangle cutout inside "A"
    const hole = new THREE.Path();
    hole.moveTo(0, 0.7);
    hole.lineTo(-0.25, -0.2);
    hole.lineTo(0.25, -0.2);
    hole.closePath();
    s.holes.push(hole);

    return s;
  }, []);

  const extrudeSettings = {
    steps: 2,
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.06,
    bevelOffset: 0,
    bevelSegments: 4,
  };

  useFrame((state, delta) => {
    if (meshRef.current) {
      // 1. Slow Y-axis idle spin (~10s per rotation)
      meshRef.current.rotation.y += delta * 0.5;

      // 2. Mouse parallax tilt (max ~12 degrees)
      const targetRotationX = (mouse.current.y * Math.PI) / 15;
      const targetRotationY = (mouse.current.x * Math.PI) / 15;

      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.08;
      meshRef.current.rotation.z += (-targetRotationY * 0.5 - meshRef.current.rotation.z) * 0.08;
    }
  });

  return (
    <Float speed={2.5} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh
        ref={meshRef}
        scale={isHovered ? size * 1.1 : size}
        position={[0, 0, 0]}
      >
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#D4A64A"
          emissive="#52390F"
          emissiveIntensity={0.2}
          roughness={0.18}
          metalness={0.8}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>
    </Float>
  );
}

export default function Aafa3DLogo({ size = 'medium', className = '' }) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Size configurations
  const containerDimensions = {
    small: 'w-10 h-10',
    medium: 'w-24 h-24',
    large: 'w-48 h-48 sm:w-64 sm:h-64',
  };

  const meshScaleFactor = {
    small: 0.6,
    medium: 0.9,
    large: 1.3,
  };

  const cameraPosition = {
    small: [0, 0, 5],
    medium: [0, 0, 5],
    large: [0, 0, 5.5],
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex items-center justify-center ${containerDimensions[size] || containerDimensions.medium} ${className}`}
    >
      {isDesktop ? (
        /* 3D React Three Fiber Canvas */
        <Suspense
          fallback={
            <div className="w-full h-full rounded-2xl bg-[#D4A64A]/20 flex items-center justify-center animate-pulse">
              <SparklesIcon className="w-6 h-6 text-[#D4A64A]" />
            </div>
          }
        >
          <Canvas
            camera={{ position: cameraPosition[size], fov: 45 }}
            className="w-full h-full"
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.9} />
            {/* Warm Gold Key Light */}
            <directionalLight position={[8, 8, 6]} intensity={2.0} color="#FAF7F0" />
            {/* Soft Navy Rim Light */}
            <pointLight position={[-8, -6, -6]} intensity={1.5} color="#D4A64A" />
            
            <ALogoMesh
              mouse={mouse}
              isHovered={isHovered}
              size={meshScaleFactor[size]}
            />
          </Canvas>
        </Suspense>
      ) : (
        /* Mobile Fallback: Lightweight SVG 3D Badge */
        <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#D4A64A] via-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-[#D4A64A]/30 border border-[#FAF7F0]/30 animate-float-slow">
          <span className="font-extrabold text-[#0B1220] font-sora tracking-tighter text-xl">
            A
          </span>
        </div>
      )}
    </div>
  );
}
