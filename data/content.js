/* ==========================================================================
   PORTFOLIO CONTENT
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit to update the site.
   - Empty strings ("") for a URL hide that link automatically.
   - Order in each list = order on the page.
   - See README.md for a template you can copy for new projects.
   ========================================================================== */

window.PORTFOLIO = {
  profile: {
    name: "Haniyeh Zahra Budaqi",
    shortName: "H. Z. Budaqi", // used to bold your name in author lists
    role: "Mechanical Engineer · Astrodynamics & Spacecraft GNC",
    tagline:
      "I work on cislunar astrodynamics, trajectory generation, and spacecraft dynamics and control, with an interest in space systems design, mission analysis, and computational methods for future space missions.",
    location: "Tehran, Iran",
    photo: "assets/img/profile.jpg", // leave "" to hide
    cv: "assets/CV_Haniyeh_Budaqi.pdf",
    links: {
      emails: ["haniyehz.budaqi@gmail.com", "haniyehz.budaqi55@sharif.edu"], // first one is used for the hero "Email" button
      github: "https://github.com/hannalujah",
      linkedin: "", // TODO e.g. "https://www.linkedin.com/in/your-handle"
      scholar: "",  // TODO e.g. "https://scholar.google.com/citations?user=XXXX"
      orcid: ""     // optional
    }
  },

  about: [
    "I am a Mechanical Engineering graduate of Sharif University of Technology. My research focuses on the Earth–Moon three-body problem: periodic orbits, transfer design, and using machine learning to generate good initial guesses for trajectory optimization.",
    "Alongside research, I have hands-on experience in embedded systems (STM32, ESP32, FreeRTOS, CAN, BLE) and hardware design. That background shapes how I think about autonomous and robust mission operations."
  ],

  researchInterests: [
    "Cislunar astrodynamics, periodic orbits, and trajectory generation in the Earth–Moon CR3BP",
    "Space mission analysis, trajectory optimization, and computational methods for space systems design",
    "Spacecraft dynamics and control, with interest in autonomous and robust mission operations"
  ],

  education: [
    {
      degree: "B.Sc. Mechanical Engineering",
      school: "Sharif University of Technology",
      location: "Tehran, Iran",
      dates: "Nov 2020 – Jul 2025",
      details: [
        "<strong>GPA:</strong> 3.44 / 4.00 (16.38 / 20.00)",
        "<strong>Focus areas:</strong> Dynamics, Robotics, Control Systems",
        "<strong>Relevant coursework:</strong> Modern Control Theory, Robotics, Orbital Mechanics",
        "<strong>Thesis:</strong> “Postural Responses to Mediolateral Rotations,” supervised by Dr. Saeed Behzadipour"
      ]
    }
  ],

  publications: [
    {
      title:
        "Projection-Constrained Generative Initialization of NRHO-DRO Transfers in the Earth-Moon CR3BP",
      authors: "H. Z. Budaqi, P. Latifiyan, M. Arsalan",
      venue: "Acta Astronautica",
      status: "Submitted",
      date: "Sep 2026",
      links: [
        { label: "Manuscript", url: "" }, // TODO add manuscript link
        { label: "Code", url: "https://github.com/hannalujah/cvae-projected-nrho-dro" }
      ],
      highlights: [
        "Developed cVAE-projected, a projection-constrained conditional VAE that generates initial-guess NRHO–DRO transfers in the Earth–Moon CR3BP, trained on 57,356 corrected trajectories.",
        "Achieved 80% guess-level success and 99.6%+ pair-level coverage across 3,133 held-out orbit pairs, outperforming Lambert and Poincaré-mapping baselines in coverage and compute cost."
      ]
    },
    {
      title: "Postural Responses to Mediolateral Rotations",
      authors: "H. Z. Budaqi, A. Mojibi, S. Behzadipour",
      venue: "ICBME 2025 Conference",
      status: "Published",
      date: "Nov 2025",
      links: [
        { label: "DOI", url: "https://doi.org/10.1109/ICBME68496.2025.11392127" }
      ],
      highlights: [
        "Derived from my undergraduate thesis. I designed and ran experiments with 15 participants across eight sensory and cognitive conditions and analyzed center-of-pressure (COP) responses with repeated-measures ANOVA.",
        "Showed that vision, surface compliance, and cognitive load each independently influence postural stability during mediolateral disturbances."
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     PROJECTS
     category: "research" | "academic" | "engineering"  (drives the filter tabs)
     featured: true shows a "Featured" badge and sorts the project first
     thumb:   card image, ideally 16:9 (falls back to `image`, then to a drawing)
     image:   large image at the top of the opened project
     gallery: extra figures shown in the opened project
     details: longer bullets shown when the card is opened
     ------------------------------------------------------------------------ */
  projects: [
    {
      id: "rl-cislunar",
      title: "Reinforcement Learning for Cislunar Mission Management",
      category: "research",
      date: "Ongoing",
      featured: true,
      tools: ["Python", "PPO", "Reinforcement Learning"],
      summary:
        "A PPO-based reinforcement learning framework to support mission-management decisions in cislunar mission design.",
      details: [
        "Developing a Proximal Policy Optimization (PPO) reinforcement learning framework to support mission management decision-making in cislunar mission design.",
        "Manuscript in preparation for journal submission."
      ],
      thumb: "",
      image: "",
      links: [{ label: "Code", url: "https://github.com/hannalujah/attitude-prox-ppo" }]
    },
    {
      id: "cvae-nrho-dro",
      title: "Generative Initialization of NRHO–DRO Transfers",
      category: "research",
      date: "2026",
      featured: true,
      tools: ["Python", "PyTorch", "Conditional VAE", "CR3BP"],
      summary:
        "A projection-constrained conditional VAE that generates initial guesses for NRHO-to-DRO transfers in the Earth–Moon CR3BP, for seeding a differential corrector.",
      details: [
        "For a queried NRHO/DRO pair, the network predicts a departure velocity, time of flight, and departure phase. A physics-based projection step then puts the departure position exactly on the origin orbit before the guess is passed to the corrector.",
        "Trained on 57,356 corrected transfers covering 6,845 distinct orbit pairs sampled from the JPL periodic-orbit catalogs.",
        "Raises guess-level physical success from 60.9% / 55.2% (schedule-matched Lambert) to 80.0% / 78.5% on partially-seen / completely-unseen test orbits, with pair-level success@5 above 99.6% on both.",
        "Compared with an automated Poincaré-mapping baseline, it gives broader pair-level coverage at about a quarter of the compute cost per physical success.",
        "An ablation without the projection step converges numerically almost as often but yields essentially no physically valid transfers, which shows the projection is essential."
      ],
      thumb: "assets/img/projects/cvae-thumb.jpg",
      image: "assets/img/projects/cvae-graphical-abstract.png",
      gallery: [
        { src: "assets/img/projects/cvae-pipeline.png", caption: "cVAE-projected pipeline" },
        { src: "assets/img/projects/cvae-orbit-families.png", caption: "Sampled NRHO and DRO families (Jacobi constant vs. period)" },
        { src: "assets/img/projects/cvae-raw-vs-projected.png", caption: "Raw vs. projected initial guesses" },
        { src: "assets/img/projects/cvae-cost-coverage.png", caption: "Cost vs. coverage against the baselines" }
      ],
      links: [
        { label: "Code", url: "https://github.com/hannalujah/cvae-projected-nrho-dro" },
        { label: "Manuscript", url: "" }
      ]
    },
    {
      id: "mars-adcs",
      title: "Attitude Dynamics & Control of a Mars-Orbiting Nano-Satellite",
      category: "academic",
      date: "Mar 2026 – Jun 2026",
      featured: false,
      tools: ["MATLAB", "STK", "MRPs", "Lyapunov control"],
      summary:
        "A nonlinear attitude simulator and Lyapunov-based controller for a satellite in low Mars orbit that switches autonomously between sun-, nadir- and comms-pointing modes. Visualized in STK.",
      details: [
        "Capstone of the CU Boulder Spacecraft Dynamics and Control specialization: a daughter-craft in a 400 km, 30° inclined low Mars orbit, with a mother-craft in Mars-synchronous orbit.",
        "Developed the nonlinear attitude dynamics (Euler's rotational equations, RK4 integration) using Modified Rodrigues Parameters (MRPs).",
        "Designed a Lyapunov-based PD-type feedback controller that tracks three reference frames: sun-pointing on the lit side, nadir-pointing on the dark side, and pointing at the mother-craft for communication when it is within 35°.",
        "Evaluated pointing error, angular velocity, and control torque across all modes, and exported the attitude history to STK for 3D visualization."
      ],
      thumb: "assets/img/projects/mars-thumb.jpg",
      image: "assets/img/projects/mars-lmo-vectors.jpg",
      gallery: [
        { src: "assets/img/projects/mars-sigma-br.png", caption: "Attitude tracking error (MRPs) over the full mission" },
        { src: "assets/img/projects/mars-omega-br.png", caption: "Angular velocity tracking error over the full mission" }
      ],
      links: [{ label: "Code", url: "https://github.com/hannalujah/SpacecraftDynamicsandControl" }]
    },
    {
      id: "robotics-coursework",
      title: "Manipulator Kinematics, Dynamics & Motion Planning",
      category: "academic",
      date: "Fall 2023",
      featured: false,
      tools: ["MATLAB", "Simulink", "Simscape", "SolidWorks"],
      summary:
        "Robotics course projects: from rigid-body transforms to Simscape models of RPP/RRP manipulators, trajectory planning, potential fields, and Dijkstra path planning.",
      details: [
        "Implemented rotation/translation transforms, forward and inverse kinematics, and Jacobian-based velocity kinematics for serial manipulators.",
        "Modeled RPP and RRP manipulators in Simulink/Simscape from SolidWorks CAD parts, and simulated trajectory tracking dynamically.",
        "Built motion planners: potential-field path generation with obstacle avoidance, a random walk, and shortest paths on a visibility graph with Dijkstra's algorithm.",
        "Robotics course, Sharif University of Technology."
      ],
      thumb: "assets/img/projects/robotics-thumb.png",
      image: "",
      gallery: [
        { src: "assets/img/projects/robotics-rrp-cad.png", caption: "CAD model of the RRP manipulator" },
        { src: "assets/img/projects/robotics-transforms.png", caption: "Rigid-body transform problem setup" },
        { src: "assets/img/projects/robotics-potential-field.png", caption: "Potential-field path between obstacles" },
        { src: "assets/img/projects/robotics-dijkstra.png", caption: "Shortest path via Dijkstra's algorithm" }
      ],
      links: [{ label: "Code", url: "https://github.com/hannalujah/robotics-coursework-fall2023" }]
    },
    {
      id: "dual-servo-platform",
      title: "Dual AC Servo Robotic Balance Platform",
      category: "engineering",
      date: "Jul 2025",
      featured: false,
      tools: ["Arduino Due", "MATLAB", "Python", "HX711"],
      summary:
        "A dual AC-servo balance platform with load-cell data acquisition for synchronized center-of-pressure measurement.",
      details: [
        "Designed and built a dual AC servo-actuated robotic balance platform.",
        "Built a load-cell / HX711 / Arduino Due data acquisition system.",
        "Wrote Python and MATLAB tools for real-time perturbation generation, synchronized COP measurement, and signal processing. The platform was used for the experiments in my thesis."
      ],
      thumb: "",
      image: "",
      links: []
    },
    {
      id: "stm32-rc522",
      title: "Non-Blocking RC522 RFID Driver for STM32",
      category: "engineering",
      date: "2026",
      featured: false,
      tools: ["C", "STM32 HAL", "SPI + DMA", "State machine"],
      summary:
        "An MFRC522 RFID reader driver that reads cards over SPI DMA through a non-blocking state machine, so the main loop never stalls.",
      details: [
        "After a short blocking init, every register access is an SPI DMA transfer: one call starts it, the DMA-complete interrupt raises chip-select and sets a flag, and a later call continues.",
        "RC522_run() advances the read state machine (REQA, then anticollision, then BCC check) one small step per call and returns at once.",
        "A card ID is accepted only after it has been confirmed several times in a row, then expires after a configurable timeout.",
        "Developed on an STM32F103C8 in STM32CubeIDE."
      ],
      thumb: "assets/img/projects/rc522-thumb.jpg",
      image: "assets/img/projects/rc522-module.jpg",
      links: [{ label: "Code", url: "https://github.com/hannalujah/stm32-rc522-driver" }]
    },
    {
      id: "bt-config-app",
      title: "Bluetooth Device Configuration App",
      category: "engineering",
      date: "2025",
      featured: false,
      tools: ["Kotlin", "Android", "Bluetooth Classic"],
      summary:
        "An Android app that connects to an embedded device over Bluetooth Classic to show its status and edit its configuration.",
      details: [
        "Connects to the device over Bluetooth Classic and displays live device status and configuration.",
        "Lets the user send device-specific commands and change configuration values for their application.",
        "Built during my work on commercial IoT systems at MG Adak."
      ],
      thumb: "",
      image: "",
      links: [{ label: "Code", url: "https://github.com/hannalujah/TestApp_Showcase" }]
    }
  ],

  experience: [
    {
      role: "Embedded Software Engineer",
      org: "Lian Battery",
      location: "Tehran, Iran",
      dates: "Jan 2026 – Present",
      bullets: [
        "Developing firmware with FreeRTOS on ESP32-S3 for real-time embedded applications.",
        "Designed a modular software architecture for CAN-based communication systems."
      ]
    },
    {
      role: "Embedded Software Engineer",
      org: "MG Adak",
      location: "Tehran, Iran",
      dates: "Apr 2025 – Jan 2026",
      bullets: [
        "Developed modular STM32 firmware for commercial IoT systems, with a focus on reliability and scalability.",
        "Developed an Android application for Bluetooth-based data exchange."
      ]
    },
    {
      role: "Electronics Assistant",
      org: "Sharif Social Robotics Lab",
      location: "Tehran, Iran",
      dates: "Oct 2025 – Jan 2026",
      bullets: [
        "Designed 2-layer PCBs and contributed to embedded system development for robotic platforms.",
        "Implemented BLE-based communication for real-time telemetry and control."
      ]
    },
    {
      role: "Electronics Engineering Intern",
      org: "Nira System Pouya",
      location: "Tehran, Iran",
      dates: "Nov 2024 – Jul 2025",
      bullets: [
        "Completed specialized courses in Embedded C programming and PCB design, followed by hands-on projects."
      ]
    }
  ],

  teaching: [
    {
      course: "Engineering Mechanics: Dynamics",
      instructor: "Dr. Somaye Mohammadi",
      school: "Sharif University of Technology",
      terms: "Fall 2026",
      duties: "Lead supplementary MATLAB tutoring sessions."
    },
    {
      course: "Orbital Mechanics",
      instructor: "Dr. Maryam Malekzadeh",
      school: "Sharif University of Technology",
      terms: "Fall 2026",
      duties: "Assign and grade problem sets."
    },
    {
      course: "Numerical Calculations",
      instructor: "Dr. Amir Nourani",
      school: "Sharif University of Technology",
      terms: "Fall 2022, Fall 2023",
      duties: "Held MATLAB tutoring sessions and graded MATLAB assignments."
    }
  ],

  skills: [
    {
      group: "Control & Dynamics",
      items: ["Spacecraft attitude dynamics", "Nonlinear control", "PID control", "System modeling", "Numerical simulation"]
    },
    {
      group: "Machine Learning",
      items: ["Conditional VAEs", "Reinforcement learning (PPO)", "ML for mission design & navigation"]
    },
    {
      group: "Programming & Simulation",
      items: ["MATLAB / Simulink", "Python", "C / C++", "Git"]
    },
    {
      group: "Embedded Systems",
      items: ["STM32", "ESP32", "AVR", "FreeRTOS", "SPI", "I2C", "UART", "DMA", "CAN", "BLE"]
    },
    {
      group: "Tools",
      items: ["STK", "SolidWorks", "Altium Designer"]
    },
    {
      group: "Languages",
      items: ["English: CEFR C2 (IELTS Academic 8.5)", "French: CEFR A2 (studying)"]
    }
  ],

  certifications: [
    { title: "Spacecraft Dynamics and Control Specialization", issuer: "CU Boulder / Coursera", url: "" },
    { title: "Introduction to MATLAB Programming", issuer: "Vanderbilt University / Coursera", url: "" },
    { title: "CS50: Introduction to Computer Science", issuer: "Harvard University", url: "" }
  ],

  awards: [
    "Ranked 97th in the National Mathematics & Physics University Entrance Exam (Iran)"
  ]
};
