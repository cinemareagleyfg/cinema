import { LessonPlan, FlashCard } from './types';

export const LESSON_PLAN: LessonPlan = {
  week1: [
    {
      day: 1,
      title: "Session Setup & Organization",
      pluginFocus: "None (Session Management)",
      description: "A clean session is a clean mind. Preparing the foundation.",
      tasks: [
        { id: "d1-1", text: "Create new Session in Pro Tools Intro (44.1kHz or 48kHz, 24-bit)." },
        { id: "d1-2", text: "Import Instrumental and Vocal tracks." },
        { id: "d1-3", text: "Color Code: Instrumentals (Blue), Lead Vocals (Red), Ad-libs (Yellow)." },
        { id: "d1-4", text: "Route all vocals to a new Stereo Aux Input named 'Voc Bus'." },
        { id: "d1-5", text: "Create a Master Fader track." }
      ]
    },
    {
      day: 2,
      title: "Gain Staging & Static Mix",
      pluginFocus: "Clip Gain & Faders",
      description: "Balancing levels before adding any plugins to ensure headroom.",
      tasks: [
        { id: "d2-1", text: "Turn down Instrumental fader to leave -6dB headroom on Master." },
        { id: "d2-2", text: "Use 'Clip Gain' on vocal regions to level out loud/quiet words visually." },
        { id: "d2-3", text: "Set vocal levels using Faders to sit 'on top' of the beat." },
        { id: "d2-4", text: "Check Master Fader: Ensure no peaking (red lights) above -3dB." }
      ]
    },
    {
      day: 3,
      title: "Subtractive EQ (Cleaning)",
      pluginFocus: "EQ III 7-Band",
      description: "Removing frequency buildup and mud.",
      tasks: [
        { id: "d3-1", text: "Insert 'EQ III 7-Band' on Lead Vocal track." },
        { id: "d3-2", text: "Engage HPF (High Pass Filter). Set freq to ~80Hz-100Hz to remove rumble." },
        { id: "d3-3", text: "Sweep Mid-frequency band with high Q (narrow) to find 'boxiness' (~300-500Hz)." },
        { id: "d3-4", text: "Cut the 'boxy' frequency by -2dB to -4dB." },
        { id: "d3-5", text: "Sweep High-mids (~2kHz-4kHz) for harshness and reduce gently." }
      ]
    },
    {
      day: 4,
      title: "Dynamic Control (Compression)",
      pluginFocus: "Dynamics III Compressor/Limiter",
      description: "Evening out the performance so every word is audible.",
      tasks: [
        { id: "d4-1", text: "Insert 'Dynamics III Compressor' after the EQ." },
        { id: "d4-2", text: "Set Ratio to 3:1 or 4:1 for vocals." },
        { id: "d4-3", text: "Adjust Attack to ~15ms (let transients through) and Release to ~50ms." },
        { id: "d4-4", text: "Lower Threshold until you see -3dB to -6dB of Gain Reduction on loud peaks." },
        { id: "d4-5", text: "Adjust Make-up Gain to match the volume when plugin is bypassed." }
      ]
    },
    {
      day: 5,
      title: "Sibilance & Noise Control",
      pluginFocus: "Dyn III De-Esser & Expander/Gate",
      description: "Polishing the edges and removing background noise.",
      tasks: [
        { id: "d5-1", text: "Insert 'Dyn III De-Esser' after the Compressor." },
        { id: "d5-2", text: "Loop a section with 'S' sounds." },
        { id: "d5-3", text: "Adjust Frequency (~5kHz-8kHz) and Range to tame harsh 'S' sounds." },
        { id: "d5-4", text: "Insert 'Dyn III Expander/Gate' (First slot in chain recommended, but okay here)." },
        { id: "d5-5", text: "Set Range to -10dB (Subtle). Adjust Threshold so it closes only when silent." }
      ]
    },
    {
      day: 6,
      title: "Additive EQ (Shaping)",
      pluginFocus: "EQ III 7-Band",
      description: "Adding sparkle and presence to cut through the mix.",
      tasks: [
        { id: "d6-1", text: "Insert a new 'EQ III 7-Band' after the Compressor." },
        { id: "d6-2", text: "Boost High Shelf (~8kHz+) by +2dB for 'Air'." },
        { id: "d6-3", text: "Boost High-Mids (~3kHz-5kHz) slightly for 'Presence' if needed." },
        { id: "d6-4", text: "A/B compare (Bypass) to ensure it sounds better, not just louder." }
      ]
    },
    {
      day: 7,
      title: "Week 1 Review",
      pluginFocus: "Critical Listening",
      description: "Rest your ears and check the balance.",
      tasks: [
        { id: "d7-1", text: "Listen to the mix at low volume." },
        { id: "d7-2", text: "Listen to a reference track (professional song) then your mix." },
        { id: "d7-3", text: "Adjust vocal volume fader if it feels too loud/quiet." },
        { id: "d7-4", text: "Consolidate or Commit tracks if CPU is struggling (Optional)." }
      ]
    }
  ],
  week2: [
    {
      day: 8,
      title: "Space & Ambience (Reverb)",
      pluginFocus: "D-Verb",
      description: "Placing the dry vocal into a space.",
      tasks: [
        { id: "d8-1", text: "Create a new Stereo Aux Input track named 'Reverb'." },
        { id: "d8-2", text: "Insert 'D-Verb' on this track (Mix: 100% Wet)." },
        { id: "d8-3", text: "Create a Send on the Lead Vocal track to the 'Reverb' track." },
        { id: "d8-4", text: "Adjust Send level. Start low and increase until felt, not just heard." },
        { id: "d8-5", text: "Select 'Plate' or 'Hall' algorithm in D-Verb." }
      ]
    },
    {
      day: 9,
      title: "Depth & Width (Delay)",
      pluginFocus: "Mod Delay III",
      description: "Adding echo for interest and sustain.",
      tasks: [
        { id: "d9-1", text: "Create a new Stereo Aux Input named 'Delay'." },
        { id: "d9-2", text: "Insert 'Mod Delay III' (Mix: 100% Wet, Feedback: ~20%)." },
        { id: "d9-3", text: "Sync tempo to 'Session' or tap tempo manually." },
        { id: "d9-4", text: "Set Note value to 1/4 note or 1/8 note." },
        { id: "d9-5", text: "Send from Vocal track to Delay. Automate send for specific phrases." }
      ]
    },
    {
      day: 10,
      title: "Parallel Compression",
      pluginFocus: "Dynamics III Compressor",
      description: "Adding weight and density without killing dynamics.",
      tasks: [
        { id: "d10-1", text: "Create a Stereo Aux named 'Parallel Comp'." },
        { id: "d10-2", text: "Send Lead Vocal to this track (0dB)." },
        { id: "d10-3", text: "Insert 'Dynamics III'. Set Ratio high (10:1 or 20:1)." },
        { id: "d10-4", text: "Crush it: Lower Threshold until -20dB gain reduction." },
        { id: "d10-5", text: "Blend the Parallel Comp fader in slowly under the main vocal." }
      ]
    },
    {
      day: 11,
      title: "Automation",
      pluginFocus: "Volume Automation",
      description: "Breathing life into the static mix.",
      tasks: [
        { id: "d11-1", text: "Switch Vocal track view from 'Waveform' to 'Volume'." },
        { id: "d11-2", text: "Draw automation: Lower breath sounds manually." },
        { id: "d11-3", text: "Raise volume on end of phrases that trail off." },
        { id: "d11-4", text: "Raise the chorus sections by +1dB for energy." }
      ]
    },
    {
      day: 12,
      title: "The Mix Bus",
      pluginFocus: "Master Fader",
      description: "Glueing the instrumental and vocals together.",
      tasks: [
        { id: "d12-1", text: "Go to Master Fader track." },
        { id: "d12-2", text: "Insert 'Dynamics III Compressor'." },
        { id: "d12-3", text: "Ratio: 1.5:1 or 2:1. Slow Attack (30ms+), Auto Release." },
        { id: "d12-4", text: "Threshold: Only 1-2dB of reduction during loud parts." }
      ]
    },
    {
      day: 13,
      title: "Limiting (Mastering)",
      pluginFocus: "Maxim",
      description: "Making it radio-ready volume without distortion.",
      tasks: [
        { id: "d13-1", text: "Insert 'Maxim' on Master Fader (Last slot)." },
        { id: "d13-2", text: "Set Ceiling to -0.2dB (Prevents digital clipping)." },
        { id: "d13-3", text: "Lower Threshold while listening. Make it loud but clear." },
        { id: "d13-4", text: "Ensure Dither is ON (24-bit or 16-bit depending on export)." }
      ]
    },
    {
      day: 14,
      title: "Final Bounce & Check",
      pluginFocus: "Bounce to Disk",
      description: "The final product.",
      tasks: [
        { id: "d14-1", text: "Select the length of the song on timeline." },
        { id: "d14-2", text: "File > Bounce to > Disk." },
        { id: "d14-3", text: "Format: Interleaved, WAV, 16-bit, 44.1kHz (Standard)." },
        { id: "d14-4", text: "Listen to exported file on Phone, Car, and Earbuds." },
        { id: "d14-5", text: "Celebrate! You finished the mix." }
      ]
    }
  ]
};

export const FLASHCARDS: FlashCard[] = [
  // Page 1: Fundamentals
  { id: 'fc-1', category: 'Term', term: 'Gain Staging', definition: 'The process of managing the relative levels of audio signals within each stage of the signal path to prevent distortion and noise.' },
  { id: 'fc-2', category: 'Term', term: 'Headroom', definition: 'The amount of space available (in dB) between your current signal level and the maximum level (0dB) before clipping occurs.' },
  { id: 'fc-3', category: 'Term', term: 'Sample Rate', definition: 'The number of samples of audio carried per second, measured in Hz or kHz (e.g., 44.1 kHz). Affects frequency range.' },
  { id: 'fc-4', category: 'Term', term: 'Bit Depth', definition: 'The number of bits of information in each sample (e.g., 24-bit). Determines the dynamic range of the audio.' },
  { id: 'fc-5', category: 'Term', term: 'Signal Flow', definition: 'The path an audio signal takes from source to output (e.g., Mic -> Preamp -> Interface -> DAW -> Master Fader).' },
  { id: 'fc-6', category: 'Plugin', term: 'Aux Input', definition: 'A track used to route audio from other tracks, often for effects returns (Reverb/Delay) or sub-mixing (Vocal Bus).' },
  { id: 'fc-7', category: 'Plugin', term: 'Master Fader', definition: 'The final volume control for the entire session mix before it leaves the DAW.' },
  { id: 'fc-8', category: 'Term', term: 'Clipping', definition: 'Distortion that occurs when a signal exceeds the maximum level (0dBFS) the system can handle, "clipping" the waveform peaks.' },
  { id: 'fc-9', category: 'Term', term: 'Waveform', definition: 'A visual representation of an audio signal showing its amplitude (loudness) over time.' },

  // Page 2: EQ
  { id: 'fc-10', category: 'Plugin', term: 'EQ (Equalizer)', definition: 'A tool used to adjust the balance of frequency components within an audio signal (Bass, Mids, Treble).' },
  { id: 'fc-11', category: 'Term', term: 'High Pass Filter (HPF)', definition: 'An EQ filter that cuts low frequencies and lets high frequencies pass through. Great for removing rumble.' },
  { id: 'fc-12', category: 'Term', term: 'Low Pass Filter (LPF)', definition: 'An EQ filter that cuts high frequencies and lets low frequencies pass through.' },
  { id: 'fc-13', category: 'Term', term: 'Frequency', definition: 'The pitch of a sound, measured in Hertz (Hz). Low numbers = Bass, High numbers = Treble.' },
  { id: 'fc-14', category: 'Term', term: 'Q (Bandwidth)', definition: 'Controls how wide or narrow an EQ band is. High Q = Narrow cut/boost. Low Q = Broad cut/boost.' },
  { id: 'fc-15', category: 'Term', term: 'Subtractive EQ', definition: 'The technique of cutting unpleasant frequencies (mud, resonance) to clean up a sound rather than boosting.' },
  { id: 'fc-16', category: 'Term', term: 'Shelf EQ', definition: 'An EQ shape that boosts or cuts all frequencies above (High Shelf) or below (Low Shelf) a set point.' },
  { id: 'fc-17', category: 'Term', term: 'Mud', definition: 'A term for unwanted frequency buildup in the low-mids (usually 200Hz - 400Hz) that makes a mix lack clarity.' },
  { id: 'fc-18', category: 'Term', term: 'Presence', definition: 'Frequencies in the upper-mids (4kHz - 6kHz) that make a vocal or instrument sound closer and more intelligible.' },

  // Page 3: Dynamics
  { id: 'fc-19', category: 'Plugin', term: 'Compression', definition: 'Automatic volume control. It lowers the loudest parts of a signal to make the overall volume more consistent.' },
  { id: 'fc-20', category: 'Term', term: 'Threshold', definition: 'The level (dB) at which a compressor or gate starts to work. Above threshold = compression happens.' },
  { id: 'fc-21', category: 'Term', term: 'Ratio', definition: 'Determines how much compression is applied once the signal crosses the threshold (e.g., 4:1 means 4dB in = 1dB out).' },
  { id: 'fc-22', category: 'Term', term: 'Attack', definition: 'How fast the compressor reacts after the signal crosses the threshold. Fast = controls peaks immediately.' },
  { id: 'fc-23', category: 'Term', term: 'Release', definition: 'How quickly the compressor stops compressing after the signal falls below the threshold.' },
  { id: 'fc-24', category: 'Term', term: 'Make-up Gain', definition: 'A control to boost the output level of a compressor to compensate for the volume lost during compression.' },
  { id: 'fc-25', category: 'Plugin', term: 'De-Esser', definition: 'A specialized frequency-dependent compressor used to reduce harsh "S" and "T" sounds (sibilance).' },
  { id: 'fc-26', category: 'Plugin', term: 'Expander / Gate', definition: 'Reduces the volume of everything BELOW the threshold. Used to silence background noise between vocals.' },
  { id: 'fc-27', category: 'Plugin', term: 'Limiter', definition: 'A compressor with a very high ratio (∞:1) that prevents signals from exceeding a specific ceiling level.' },

  // Page 4: Time-Based Effects
  { id: 'fc-28', category: 'Plugin', term: 'Reverb', definition: 'Simulates the sound of a physical space (Room, Hall, Plate) by creating thousands of dense reflections.' },
  { id: 'fc-29', category: 'Plugin', term: 'Delay', definition: 'Creates distinct echoes of the original signal at set time intervals.' },
  { id: 'fc-30', category: 'Term', term: 'Wet / Dry Mix', definition: 'The balance between the effected signal (Wet) and the original signal (Dry).' },
  { id: 'fc-31', category: 'Term', term: 'Pre-Delay', definition: 'The time gap between the direct sound and the start of the reverb tail. Helps separate vocals from the reverb.' },
  { id: 'fc-32', category: 'Term', term: 'Feedback', definition: 'In a delay plugin, this controls how many times the echo repeats.' },
  { id: 'fc-33', category: 'Term', term: 'Send', definition: 'A routing function that splits a signal to send a copy to another track (usually for Parallel processing or Effects).' },
  { id: 'fc-34', category: 'Term', term: 'Return', definition: 'The Aux track where the "Send" signal arrives and is processed (e.g., the Reverb track).' },
  { id: 'fc-35', category: 'Term', term: 'Insert', definition: 'A slot on a track where an effect is placed directly into the signal chain (affects 100% of the sound).' },
  { id: 'fc-36', category: 'Term', term: 'Mono vs Stereo', definition: 'Mono is a single channel of audio (center). Stereo uses two channels (Left & Right) to create width.' },

  // Page 5: Advanced & Export
  { id: 'fc-37', category: 'Concept', term: 'Parallel Compression', definition: 'Mixing a heavily compressed version of a track with the uncompressed version to add body while keeping dynamics.' },
  { id: 'fc-38', category: 'Term', term: 'Automation', definition: 'Programming changes over time (Volume, Pan, Plugin parameters) so the mix evolves dynamically.' },
  { id: 'fc-39', category: 'Term', term: 'Bus', definition: 'A path where multiple audio signals are combined (summed) together.' },
  { id: 'fc-40', category: 'Plugin', term: 'Dither', definition: 'Low-level noise added when reducing bit-depth (e.g., 24-bit to 16-bit) to prevent quantization distortion.' },
  { id: 'fc-41', category: 'Term', term: 'Bounce', definition: 'The process of exporting your final mix from the DAW to a stereo audio file (WAV/MP3).' },
  { id: 'fc-42', category: 'Concept', term: 'Reference Track', definition: 'A professionally mixed song you compare your mix against to check balance and tone.' },
  { id: 'fc-43', category: 'Term', term: 'Transients', definition: 'The initial, high-energy burst of sound at the beginning of a waveform (e.g., the crack of a snare).' },
  { id: 'fc-44', category: 'Plugin', term: 'Maxim', definition: 'A peak limiter plugin in Pro Tools often used on the Master Fader to maximize loudness.' },
  { id: 'fc-45', category: 'Concept', term: 'Ceiling', definition: 'The absolute maximum level a limiter will allow the signal to reach (usually set to -0.1 or -0.2 dB).' },
];