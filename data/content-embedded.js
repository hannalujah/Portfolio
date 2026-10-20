/* ==========================================================================
   EMBEDDED PORTFOLIO CONTENT  (served at /embedded/)
   --------------------------------------------------------------------------
   This file builds on data/content.js, which loads first. Projects, experience,
   education and publications are taken from there, so you edit them in ONE
   place. This file only decides:
     - the embedded-specific wording (role, tagline, about, capabilities, skills)
     - WHICH projects appear here, in what order, and under which category
   To add a project here: add it to content.js, then add its id to `projects`
   below.
   ========================================================================== */

(function () {
  const base = window.PORTFOLIO;

  function pick(id, overrides) {
    const pr = base.projects.find((p) => p.id === id);
    if (!pr) {
      console.warn(`content-embedded.js: no project with id "${id}" in content.js`);
      return null;
    }
    return { ...pr, ...overrides };
  }

  // Tech tags shown under each job, matched by organization name.
  const jobTags = {
    "Lian Battery": ["C/C++", "FreeRTOS", "ESP32-S3", "CAN"],
    "MG Adak": ["C", "STM32", "Android", "Bluetooth"],
    "Sharif Social Robotics Lab": ["Altium Designer", "2-layer PCB", "BLE"],
    "Nira System Pouya": ["Embedded C", "PCB design"]
  };

  window.PORTFOLIO = {
    profile: {
      ...base.profile,
      role: "Embedded Software Engineer · Real-Time Firmware",
      tagline:
        "I build real-time C/C++ firmware (FreeRTOS, STM32, ESP32) for embedded and robotic systems, backed by a research background in spacecraft GNC and astrodynamics for autonomous rendezvous and proximity operations.",
      cv: "assets/CV_Haniyeh_Budaqi_Embedded.pdf"
    },

    about: [
      "I'm an embedded software engineer with a Mechanical Engineering degree from Sharif University of Technology. Day to day I write firmware: FreeRTOS applications on the ESP32-S3, CAN-based subsystem interfaces, and modular STM32 firmware for commercial IoT products.",
      "I like firmware that stays responsive under load: DMA-driven drivers, non-blocking state machines, and clean module boundaries. I also design the boards it runs on. My research in spacecraft attitude control and cislunar trajectory design is what draws me toward flight software."
    ],

    capabilities: [
      {
        title: "Real-time firmware",
        text: "FreeRTOS applications, interrupt- and DMA-driven drivers, and non-blocking state machines that keep the main loop free.",
        tags: ["C/C++", "FreeRTOS", "STM32", "ESP32-S3"]
      },
      {
        title: "Communication interfaces",
        text: "CAN subsystem interfaces, SPI/I2C/UART peripherals over DMA, and BLE / Bluetooth Classic links for telemetry and control.",
        tags: ["CAN", "SPI", "I2C", "UART", "BLE"]
      },
      {
        title: "Hardware & bring-up",
        text: "Schematic and 2-layer PCB design in Altium, from layout to boards that worked on the first fabrication run, plus sensor and DAQ integration.",
        tags: ["Altium Designer", "PCB", "HX711", "Arduino Due"]
      },
      {
        title: "GNC & simulation",
        text: "Spacecraft attitude dynamics and nonlinear control, CR3BP trajectory design, and reinforcement learning for proximity operations.",
        tags: ["MATLAB/Simulink", "Python", "STK", "MRPs"]
      }
    ],

    categories: {
      firmware: { label: "Firmware", badge: "badge-accent", art: "engineering" },
      hardware: { label: "Hardware", badge: "badge-warm", art: "engineering" },
      tools: { label: "Apps & Tools", badge: "", art: "engineering" },
      gnc: { label: "GNC & Simulation", badge: "", art: "research" }
    },

    // Order here = order on the page. Featured ones are sorted first.
    projects: [
      pick("stm32-rc522", { category: "firmware", featured: true }),
      pick("social-robot-pcbs", { category: "hardware", featured: true }),
      pick("dual-servo-platform", { category: "hardware", featured: false }),
      pick("bt-config-app", { category: "tools", featured: false }),
      pick("mars-adcs", { category: "gnc", featured: false }),
      pick("rl-cislunar", { category: "gnc", featured: false })
    ].filter(Boolean),

    experience: base.experience.map((x) => ({ ...x, tags: jobTags[x.org] || [] })),

    skills: [
      { group: "Embedded & Real-Time", items: ["STM32", "ESP32 / ESP32-S3", "AVR", "FreeRTOS", "STM32 HAL", "Interrupts & DMA"] },
      { group: "Interfaces & Protocols", items: ["CAN", "SPI", "I2C", "UART", "BLE", "Bluetooth Classic"] },
      { group: "Programming", items: ["C", "C++", "Python", "MATLAB / Simulink", "Kotlin (Android)", "Git"] },
      { group: "Hardware", items: ["Altium Designer", "2-layer PCB design", "Load-cell / HX711 DAQ", "SolidWorks"] },
      { group: "Control & Simulation", items: ["Spacecraft attitude dynamics", "Nonlinear control", "PID control", "System modeling", "STK"] },
      { group: "Languages", items: ["English: CEFR C2 (IELTS Academic 8.5)", "French: CEFR A2 (studying)"] }
    ],

    education: base.education,
    certifications: base.certifications,
    awards: base.awards
  };
})();
