import * as THREE from 'three';
import vertex from '../shaders/vertex.glsl';
import fragment from '../shaders/fragment.glsl';
import { gsap } from 'gsap';

class Site {
    constructor({ dom }) {
        this.time = 0;
        this.container = dom;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.images = [...document.querySelectorAll('.images img')]; // removed extra space
        this.material;
        this.imagestoe = [];
        this.uStartindex = 1;
        this.uEndindex = 2;

        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.width / this.height,
            100,
            2000
        );
        this.camera.position.z = 200; // move camera back further
        this.camera.fov = 2 * Math.atan((this.height / 2) / 200) * (180 / Math.PI);
        this.camera.updateProjectionMatrix();
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement)

        this.renderer.render(this.scene, this.camera);


        this.addImage();
        this.resize();
        this.setResize();
        this.setposition();
        this.hoverlinks();
        this.closemenu();
        this.render();
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.camera.aspect = this.width / this.height;
        this.renderer.setSize(this.width, this.height);
        this.camera.updateProjectionMatrix();
        this.setposition();
    }

    setResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    setposition() {
        this.imagestoe.forEach(o => {
            const bounds = o.img.getBoundingClientRect();
            o.mesh.position.y = -bounds.top + this.height / 2 - bounds.height / 2;
            o.mesh.position.x = bounds.left - this.width / 2 + bounds.width / 2;
        })
    }

    addImage() {
        const textureLoader = new THREE.TextureLoader();

        // 1. Load all images into textures array
        const textures = this.images.map(img => textureLoader.load(img.src));

        // 2. Use the first image's bounding box for geometry
        const img = this.images[0];
        if (!img) return;
        const bounds = img.getBoundingClientRect();
        const geometry = new THREE.PlaneGeometry(bounds.width, bounds.height);

        // 3. Create shader uniforms
        const uniforms = {
            uTime: { value: 0.0 },
            uTimeline: { value: 0.0 },
            uStartindex: { value: 0.0 },  // float!
            uEndindex: { value: 1.0 },    // float!
            uImage1: { value: textures[0] || null },
            uImage2: { value: textures[1] || null },
            uImage3: { value: textures[2] || null },
            uImage4: { value: textures[3] || null }
        };

        // 4. Create ShaderMaterial
        // 4. Create ShaderMaterial
        this.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true,
        });


        // 5. Create mesh, add to scene, and push to imagestoe
        const mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(mesh);
        this.imagestoe.push({
            img: img,
            mesh: mesh,
            top: bounds.top,
            left: bounds.left,
            width: bounds.width,
            height: bounds.height
        });
    }

    hoverlinks() {
        const links = [...document.querySelectorAll('.right a')];
        links.forEach((link, i) => {
            link.addEventListener('mouseover', (e) => {
                this.material.uniforms.uTimeline.value = 0.0;
                gsap.to(this.material.uniforms.uTimeline, {
                    value: 4.1,
                    duration: 3,
                    onStart: () => {
                        this.uEndindex = i;
                        this.material.uniforms.uStartindex.value = this.uStartindex;
                        this.material.uniforms.uEndindex.value = this.uEndindex;
                        this.uStartindex = this.uEndindex;
                        console.log(this.uStartindex, this.uEndindex);
                    }
                })
            });
        });
    }

    closemenu(){
        const closebuttonn = document.querySelector('.close-btn');
        const mainmenu = document.querySelector('.right');
        const screenwidth = document.querySelector('.left');
        let isOpen = false;
        closebuttonn.addEventListener('click', () => {
            if(!isOpen){
                mainmenu.style.display = 'none';
                closebuttonn.innerHTML = 'open menu <i class="ri-menu-3-fill"></i> ';
                screenwidth.style.width = '80%';
                this.resize();
                console.log("clicked" , true);
                isOpen = true;
            } else {
                mainmenu.style.display = 'flex';
                closebuttonn.innerHTML = 'close menu <i class="ri-close-large-fill"></i> ';
                screenwidth.style.width = '50%';
                this.resize();
                console.log("clicked" , false);
                isOpen = false;
            }
        });
    }
    render() {
        this.time += .1;
        this.material.uniforms.uTime.value = this.time;
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(this.render.bind(this));
    }
}

new Site({
    dom: document.querySelector('.left')
});
