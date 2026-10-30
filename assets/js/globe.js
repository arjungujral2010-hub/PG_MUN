/**
 * PG-MUN 2026 - Interactive 3D Diplomatic Globe
 * Canvas-based interactive sphere with diplomatic hubs, latitude/longitude lines,
 * glowing atmosphere, and responsive drag-to-spin interaction.
 */

(function () {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : 600);
  let height = (canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : 600);

  // Diplomatic Key Hubs [lat, lon, name]
  const hubs = [
    { lat: 18.9894, lon: 73.1175, name: 'DPGA New Panvel', main: true }, // Host Venue
    { lat: 40.7489, lon: -73.9680, name: 'UN HQ New York', main: false },
    { lat: 46.2237, lon: 6.1399, name: 'UN Geneva', main: false },
    { lat: -1.2333, lon: 36.8167, name: 'UNEP Nairobi', main: false },
    { lat: 52.0705, lon: 4.3007, name: 'The Hague ICJ', main: false },
    { lat: 35.6762, lon: 139.6503, name: 'Tokyo', main: false },
    { lat: 51.5074, lon: -0.1278, name: 'London', main: false },
    { lat: -15.7975, lon: -47.8919, name: 'Brasilia', main: false },
    { lat: 30.0444, lon: 31.2357, name: 'Cairo', main: false }
  ];

  let radius = Math.min(width, height) * 0.42;
  let rotationX = 0.25;
  let rotationY = 0;
  let autoSpeed = 0.0035;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let dragVelocityX = 0;
  let dragVelocityY = 0;

  function resize() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width * window.devicePixelRatio || 600;
    height = canvas.height = rect.height * window.devicePixelRatio || 600;
    radius = Math.min(width, height) * 0.42;
  }

  window.addEventListener('resize', resize);
  resize();

  // Mouse / Touch Interaction
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    dragVelocityX = 0;
    dragVelocityY = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    dragVelocityX = deltaX * 0.005;
    dragVelocityY = deltaY * 0.005;
    rotationY += dragVelocityX;
    rotationX -= dragVelocityY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      lastMouseX = e.touches[0].clientX;
      lastMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMouseX;
    const deltaY = e.touches[0].clientY - lastMouseY;
    dragVelocityX = deltaX * 0.005;
    dragVelocityY = deltaY * 0.005;
    rotationY += dragVelocityX;
    rotationX -= dragVelocityY;
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Spherical Coordinates Projector
  function project(lat, lon) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180) + rotationY;

    // 3D coordinates
    let x = -radius * Math.sin(phi) * Math.cos(theta);
    let z = radius * Math.sin(phi) * Math.sin(theta);
    let y = radius * Math.cos(phi);

    // Rotate along X axis
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    const yRot = y * cosX - z * sinX;
    const zRot = y * sinX + z * cosX;

    const centerX = width / 2;
    const centerY = height / 2;

    return {
      x: centerX + x,
      y: centerY - yRot,
      z: zRot,
      visible: zRot > -10
    };
  }

  // Generate sphere dot grid
  const gridPoints = [];
  for (let lat = -80; lat <= 80; lat += 12) {
    const count = Math.max(12, Math.floor(Math.cos(lat * Math.PI / 180) * 36));
    for (let i = 0; i < count; i++) {
      const lon = (i / count) * 360 - 180;
      gridPoints.push({ lat, lon });
    }
  }

  let pulseTimer = 0;

  function render() {
    pulseTimer += 0.035;
    if (!isDragging) {
      rotationY += autoSpeed;
      rotationX += dragVelocityY;
      rotationY += dragVelocityX;
      dragVelocityX *= 0.94;
      dragVelocityY *= 0.94;
    }

    // Keep X in reasonable tilt
    rotationX = Math.max(-0.6, Math.min(0.6, rotationX));

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // 1. Outer Atmosphere Glow
    const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.85, centerX, centerY, radius * 1.25);
    glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
    glowGrad.addColorStop(0.5, 'rgba(37, 99, 235, 0.06)');
    glowGrad.addColorStop(1, 'rgba(3, 7, 18, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.25, 0, Math.PI * 2);
    ctx.fill();

    // 2. Base Sphere Silhouette
    const sphereGrad = ctx.createRadialGradient(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.1, centerX, centerY, radius);
    sphereGrad.addColorStop(0, '#0c1e40');
    sphereGrad.addColorStop(0.6, '#061026');
    sphereGrad.addColorStop(1, '#030713');
    ctx.fillStyle = sphereGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // 3. Globe Ring Rim
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 4. Latitude rings
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    [-45, 0, 45].forEach(lat => {
      ctx.beginPath();
      let first = true;
      for (let lon = -180; lon <= 180; lon += 6) {
        const p = project(lat, lon);
        if (p.visible) {
          if (first) {
            ctx.moveTo(p.x, p.y);
            first = false;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        } else {
          first = true;
        }
      }
      ctx.stroke();
    });

    // 5. Draw Grid Points
    gridPoints.forEach(pt => {
      const p = project(pt.lat, pt.lon);
      if (p.visible) {
        const alpha = Math.max(0.1, (p.z + radius) / (2 * radius));
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.55})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 6. Connecting Arcs to Host Venue (DPGA New Panvel)
    const hostPt = project(hubs[0].lat, hubs[0].lon);
    if (hostPt.visible) {
      hubs.slice(1).forEach(hub => {
        const targetPt = project(hub.lat, hub.lon);
        if (targetPt.visible) {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(hostPt.x, hostPt.y);
          // quadratic curve arc bulging outward
          const midX = (hostPt.x + targetPt.x) / 2;
          const midY = (hostPt.y + targetPt.y) / 2 - 30;
          ctx.quadraticCurveTo(midX, midY, targetPt.x, targetPt.y);
          ctx.stroke();
        }
      });
    }

    // 7. Draw Diplomatic Hub Markers
    hubs.forEach(hub => {
      const p = project(hub.lat, hub.lon);
      if (p.visible) {
        if (hub.main) {
          // Host Venue (DPGA) - Pulsing Golden & Cyan Beacon
          const pulse = (Math.sin(pulseTimer * 2) + 1) * 0.5;
          ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7 + pulse * 6, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Label
          ctx.font = 'bold 12px "Outfit", sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 8;
          ctx.fillText('★ DPGA Panvel', p.x + 8, p.y - 8);
          ctx.shadowBlur = 0;
        } else {
          // Secondary International Node
          ctx.fillStyle = '#00f0ff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.8, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(0, 240, 255, 0.25)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    });

    requestAnimationFrame(render);
  }

  render();
})();
