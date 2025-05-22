declare module 'three/examples/jsm/loaders/GLTFLoader' {
    import { Group, Loader } from 'three';

    export interface GLTF {
        scene: Group;
        scenes: Group[];
        animations: any[];
        cameras: any[];
        asset: any;
    }

    export class GLTFLoader extends Loader {
        load(
            url: string,
            onLoad: (gltf: GLTF) => void,
            onProgress?: (event: ProgressEvent) => void,
            onError?: (event: ErrorEvent) => void
        ): void;
    }
}

declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, Object3D } from 'three';

    export class OrbitControls {
        constructor(camera: Camera, domElement?: HTMLElement);
        enabled: boolean;
        enableDamping: boolean;
        dampingFactor: number;
        update(): void;
        dispose(): void;
    }
} 