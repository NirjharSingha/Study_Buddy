"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

interface ThreeSceneProps {
    loading: boolean;
    setLoading: (loading: boolean) => void;
    loadingProgress: number;
    setLoadingProgress: (progress: number) => void;
    setError: (error: string | null) => void;
    dimensions: { width: number; height: number };
}

const ThreeScene: React.FC<ThreeSceneProps> = ({
    loading,
    setLoading,
    loadingProgress,
    setLoadingProgress,
    setError,
    dimensions
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const [mounted, setMounted] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !containerRef.current || dimensions.width === 0) return;

        // Cleanup previous scene if it exists
        if (rendererRef.current) {
            rendererRef.current.dispose();
            if (containerRef.current.contains(rendererRef.current.domElement)) {
                containerRef.current.removeChild(rendererRef.current.domElement);
            }
        }

        // Set up scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);
        sceneRef.current = scene;

        // Set up camera
        const camera = new THREE.PerspectiveCamera(
            75,
            dimensions.width / dimensions.height,
            0.1,
            1000
        );
        camera.position.z = 5;
        cameraRef.current = camera;

        // Set up renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(dimensions.width, dimensions.height);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Add orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controlsRef.current = controls;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Load model
        const loader = new GLTFLoader();
        loader.load(
            '/models/dinosaur.glb',
            (gltf: GLTF) => {
                const model = gltf.scene;
                // Center and scale the model
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                const scale = 2 / maxDim;
                model.scale.multiplyScalar(scale);
                model.position.sub(center.multiplyScalar(scale));
                scene.add(model);
                modelRef.current = model;
                setLoading(false);
            },
            (xhr: ProgressEvent) => {
                const progress = (xhr.loaded / xhr.total) * 100;
                setLoadingProgress(Math.round(progress));
            },
            (error: ErrorEvent) => {
                console.error('Error loading model:', error);
                setError(t('Error loading dinosaur model. Please try refreshing the page.'));
                setLoading(false);
            }
        );

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            if (controlsRef.current) {
                controlsRef.current.update();
            }
            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            if (rendererRef.current) {
                rendererRef.current.dispose();
                if (containerRef.current?.contains(rendererRef.current.domElement)) {
                    containerRef.current.removeChild(rendererRef.current.domElement);
                }
            }
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
            if (sceneRef.current) {
                sceneRef.current.clear();
            }
        };
    }, [dimensions, setLoading, setLoadingProgress, setError, t, mounted]);

    if (!mounted) {
        return <div ref={containerRef} className="w-full h-full" />;
    }

    return <div ref={containerRef} className="w-full h-full" />;
};

export default ThreeScene; 