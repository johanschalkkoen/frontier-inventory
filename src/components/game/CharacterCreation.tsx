import { useState, useMemo } from 'react';
import { characters } from '@/data/characters';
import { archetypes, TRAIT_CATEGORIES, TOTAL_TRAIT_POINTS, MAX_PER_TRAIT, type TraitCategory } from '@/data/archetypes';
import { DEFAULT_SKILLS, SKILL_CATEGORIES, SKILL_ICONS, type PlayerSkills } from '@/data/gameData';
import { STAT_CLASSES, type StatClass, generateRandomName, getStatClassBonuses } from '@/data/statClasses';
import { ChevronLeft, ChevronRight, Minus, Plus, Shuffle } from 'lucide-react';

const TOTAL_CLASS_POINTS = 28;
const MIN_STAT = 1;
const MAX_STAT = 10;

interface CharacterCreationProps {
  onComplete: (data: {
    characterName: string;
    archetypeId: string;
    portraitId: string;
    traitPoints: Record<string, number>;
    statClassId: string;
    statClassValues: Record<string, number>;
  }) => void;
}

export function CharacterCreation({ onComplete }: CharacterCreationProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [characterName, setCharacterName] = useState('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedArchetype, setSelectedArchetype] = useState(archetypes.find(a => a.gender === 'male')!.id);
  const [selectedPortrait, setSelectedPortrait] = useState(characters.find(c => c.gender === 'male')!.id);
  const [traitPoints, setTraitPoints] = useState<Record<TraitCategory, number>>(
    Object.fromEntries(TRAIT_CATEGORIES.map(t => [t, 0])) as Record<TraitCategory, number>
  );
  // Stat class selection
  const [selectedStatClass, setSelectedStatClass] = useState<string>('grits');
  const statClass = STAT_CLASSES.find(sc => sc.id === selectedStatClass)!;
  
  // Initialize stat values for all classes
  const [classValues, setClassValues] = useState<Record<string, Record<string, number>>>(() => {
    const initial: Record<string, Record<string, number>> = {};
    for (const sc of STAT_CLASSES) {
      const vals: Record<string, number> = {};
      for (const attr of sc.attributes) {
        vals[attr.key] = Math.floor(TOTAL_CLASS_POINTS / sc.attributes.length);
      }
      initial[sc.id] = vals;
    }
    return initial;
  });

  const currentValues = classValues[selectedStatClass] || {};
  const valuesUsed = Object.values(currentValues).reduce((s, v) => s + v, 0);
  const valuesLeft = TOTAL_CLASS_POINTS - valuesUsed;

  const archetype = archetypes.find(a => a.id === selectedArchetype)!;
  const portrait = characters.find(c => c.id === selectedPortrait)!;
  const pointsUsed = Object.values(traitPoints).reduce((s, v) => s + v, 0);
  const pointsLeft = TOTAL_TRAIT_POINTS - pointsUsed;

  const genderPortraits = useMemo(() => characters.filter(c => c.gender === selectedGender), [selectedGender]);
  const genderArchetypes = useMemo(() => archetypes.filter(a => a.gender === selectedGender), [selectedGender]);

  const handleGenderChange = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
    const firstPortrait = characters.find(c => c.gender === gender);
    const firstArchetype = archetypes.find(a => a.gender === gender);
    if (firstPortrait) setSelectedPortrait(firstPortrait.id);
    if (firstArchetype) setSelectedArchetype(firstArchetype.id);
  };

  const adjustTrait = (trait: TraitCategory, delta: number) => {
    setTraitPoints(prev => {
      const newVal = prev[trait] + delta;
      if (newVal < 0 || newVal > MAX_PER_TRAIT) return prev;
      const newUsed = pointsUsed + delta;
      if (newUsed > TOTAL_TRAIT_POINTS) return prev;
      return { ...prev, [trait]: newVal };
    });
  };

  const adjustClassStat = (key: string, delta: number) => {
    setClassValues(prev => {
      const vals = { ...prev[selectedStatClass] };
      const newVal = (vals[key] || MIN_STAT) + delta;
      if (newVal < MIN_STAT || newVal > MAX_STAT) return prev;
      const newUsed = valuesUsed + delta;
      if (newUsed > TOTAL_CLASS_POINTS) return prev;
      vals[key] = newVal;
      return { ...prev, [selectedStatClass]: vals };
    });
  };

  const randomizeName = () => {
    setCharacterName(generateRandomName(selectedGender));
  };

  // Calculate derived stats from class
  const derivedBonuses = getStatClassBonuses(selectedStatClass, currentValues);
  const derivedHealth = 100 + (derivedBonuses.health || 0);
  const derivedDamage = 5 + (derivedBonuses.damage || 0);
  const derivedSpeed = 10 + (derivedBonuses.speed || 0);

  const handleComplete = () => {
    if (!characterName.trim()) return;
    onComplete({
      characterName: characterName.trim(),
      archetypeId: selectedArchetype,
      portraitId: selectedPortrait,
      traitPoints,
      statClassId: selectedStatClass,
      statClassValues: currentValues,
    });
  };

  const canProceed = step === 1 ? characterName.trim().length > 0 : true;
  const totalSteps = 5;
  const stepLabels = ['Name & Portrait', 'Choose Your Path', `Choose Your Class`, 'Allocate Traits', 'Final Summary'];

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-2 md:p-4">
      <div className="w-full max-w-2xl bg-game-container border-4 border-game-slot shadow-[0_0_50px_rgba(0,0,0,0.8)] p-4 md:p-6 max-h-[90vh] overflow-y-auto">
        <h1 className="font-display text-xl md:text-2xl font-black text-accent tracking-wider text-center mb-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          Create Your Legend
        </h1>
        <p className="text-center text-muted-foreground text-xs mb-5">
          Step {step} of {totalSteps} — {stepLabels[step - 1]}
        </p>

        {/* Step indicators */}
        <div className="flex justify-center gap-1.5 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`w-12 h-1 rounded-sm transition-all ${i < step ? 'bg-accent' : 'bg-game-slot-border'}`} />
          ))}
        </div>

        {/* STEP 1: Name & Portrait */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-accent font-display font-bold text-sm mb-2">CHARACTER NAME</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={characterName}
                  onChange={e => setCharacterName(e.target.value.slice(0, 24))}
                  placeholder="Enter your frontier name..."
                  className="flex-1 bg-game-slot border-2 border-game-slot-border text-foreground px-3 py-2.5 font-body text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground"
                  autoFocus
                />
                <button onClick={randomizeName}
                  className="px-3 py-2.5 bg-primary/20 border-2 border-primary text-primary hover:bg-primary/40 transition-colors flex items-center gap-1"
                  title="Randomize Name">
                  <Shuffle className="w-4 h-4" />
                  <span className="text-[9px] font-bold hidden md:inline">RANDOM</span>
                </button>
              </div>
              <span className="text-[9px] text-muted-foreground mt-1 block">{characterName.length}/24</span>
            </div>

            <div>
              <label className="block text-accent font-display font-bold text-sm mb-2">GENDER</label>
              <div className="flex gap-2">
                {(['male', 'female'] as const).map(g => (
                  <button key={g} onClick={() => handleGenderChange(g)}
                    className={`flex-1 py-2.5 text-sm font-bold font-display border-2 transition-all ${
                      selectedGender === g
                        ? 'bg-primary border-accent text-primary-foreground'
                        : 'bg-game-slot-border border-game-slot text-foreground hover:bg-secondary'
                    }`}>
                    {g === 'male' ? '♂ MALE' : '♀ FEMALE'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-accent font-display font-bold text-sm mb-2">CHOOSE YOUR LOOK</label>
              <div className="flex gap-4 items-center justify-center">
                <div className="relative w-[140px] h-[200px] bg-game-slot border-2 border-accent overflow-hidden">
                  <img src={portrait.img} alt={portrait.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                {genderPortraits.map(c => (
                  <button key={c.id} onClick={() => setSelectedPortrait(c.id)}
                    className={`w-12 h-12 border-2 overflow-hidden transition-all ${
                      c.id === selectedPortrait
                        ? 'border-accent shadow-[0_0_8px_hsl(var(--game-gold)/0.5)]'
                        : 'border-game-slot-border opacity-60 hover:opacity-100'
                    }`}>
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Archetype */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-accent font-display font-bold text-sm mb-2">
              CHOOSE YOUR ARCHETYPE ({selectedGender === 'male' ? 'MALE' : 'FEMALE'})
            </label>
            <div className="grid grid-cols-2 gap-3">
              {genderArchetypes.map(a => (
                <button key={a.id} onClick={() => setSelectedArchetype(a.id)}
                  className={`text-left p-3 border-2 transition-all ${
                    a.id === selectedArchetype
                      ? 'border-accent bg-game-slot shadow-[0_0_12px_hsl(var(--game-gold)/0.3)]'
                      : 'border-game-slot-border bg-game-slot/50 hover:border-primary'
                  }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-accent font-display font-bold text-xs">{a.name}</span>
                  </div>
                  <span className="text-muted-foreground text-[10px]">{a.title}</span>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {a.traits.map(t => (
                      <span key={t} className="text-[8px] bg-game-slot-border px-1.5 py-0.5 text-foreground">{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-game-slot border border-game-slot-border p-3 mt-3">
              <h3 className="text-accent font-display font-bold text-sm mb-1">{archetype.name} — {archetype.title}</h3>
              <div className="mb-2">
                <span className="text-[9px] text-primary font-bold">SKILLS:</span>
                <div className="flex gap-1 mt-0.5 flex-wrap">
                  {archetype.skills.map(s => (
                    <span key={s} className="text-[9px] bg-secondary px-1.5 py-0.5 text-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <span className="text-[9px] text-primary font-bold">STAT BONUSES:</span>
                <div className="flex gap-2 mt-0.5 flex-wrap">
                  {Object.entries(archetype.bonusStats).map(([k, v]) => (
                    <span key={k} className="text-[9px] text-rarity-advanced font-bold">+{v} {k.toUpperCase()}</span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-4">{archetype.backstory}</p>
            </div>
          </div>
        )}

        {/* STEP 3: Choose Stat Class & Allocate */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="text-accent font-display font-bold text-sm block">CHOOSE YOUR STAT CLASS</label>
            <p className="text-[10px] text-muted-foreground -mt-2">
              Select the system that defines your character's core attributes.
            </p>

            {/* Class selection tabs */}
            <div className="flex gap-1 flex-wrap">
              {STAT_CLASSES.map(sc => (
                <button key={sc.id} onClick={() => setSelectedStatClass(sc.id)}
                  className={`px-2.5 py-1.5 text-[10px] font-bold font-display border-2 transition-all ${
                    selectedStatClass === sc.id
                      ? 'border-accent bg-accent/20 text-accent shadow-[0_0_8px_hsl(var(--game-gold)/0.3)]'
                      : 'border-game-slot-border bg-game-slot/50 text-foreground hover:border-primary'
                  }`}>
                  {sc.acronym}
                </button>
              ))}
            </div>

            {/* Selected class info */}
            <div className="bg-game-slot/60 border border-accent/30 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-accent font-display font-bold text-base tracking-widest">{statClass.acronym}</span>
                <span className="text-[9px] text-muted-foreground italic">— {statClass.tone}</span>
              </div>
              <p className="text-[10px] text-foreground/70 italic mb-3">{statClass.description}</p>

              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-primary font-bold">ALLOCATE POINTS</span>
                <span className={`text-sm font-bold font-display ${valuesLeft > 0 ? 'text-accent' : 'text-rarity-advanced'}`}>
                  {valuesLeft} points left
                </span>
              </div>
              <p className="text-[9px] text-muted-foreground mb-2">
                Distribute {TOTAL_CLASS_POINTS} points. Min {MIN_STAT}, Max {MAX_STAT} each.
              </p>

              <div className="space-y-2">
                {statClass.attributes.map(attr => (
                  <div key={attr.key} className="bg-game-slot border border-game-slot-border p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-accent/20 border border-accent/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-display font-bold text-sm">{attr.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-bold text-foreground uppercase">{attr.name}</span>
                          <span className="text-accent font-bold text-sm font-display">{currentValues[attr.key] || MIN_STAT}</span>
                        </div>
                        <p className="text-[7px] text-muted-foreground leading-tight">{attr.desc}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => adjustClassStat(attr.key, -1)} disabled={(currentValues[attr.key] || MIN_STAT) <= MIN_STAT}
                          className="w-6 h-6 flex items-center justify-center bg-game-slot-border hover:bg-primary disabled:opacity-30 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="flex gap-0.5">
                          {Array.from({ length: MAX_STAT }).map((_, i) => (
                            <div key={i} className={`w-2 h-4 border transition-all ${
                              i < (currentValues[attr.key] || MIN_STAT) ? 'bg-accent border-accent' : 'bg-game-slot border-game-slot-border'
                            }`} />
                          ))}
                        </div>
                        <button onClick={() => adjustClassStat(attr.key, 1)} disabled={(currentValues[attr.key] || MIN_STAT) >= MAX_STAT || valuesLeft <= 0}
                          className="w-6 h-6 flex items-center justify-center bg-game-slot-border hover:bg-primary disabled:opacity-30 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Derived stats preview */}
            <div className="bg-game-slot/60 border border-game-slot-border p-3">
              <span className="text-[9px] text-primary font-bold block mb-1.5">DERIVED STATS PREVIEW</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-game-slot/80 border border-game-slot-border p-1.5">
                  <span className="text-[7px] text-muted-foreground block">MAX HP</span>
                  <span className="text-accent font-bold text-sm font-display">{derivedHealth}</span>
                </div>
                <div className="bg-game-slot/80 border border-game-slot-border p-1.5">
                  <span className="text-[7px] text-muted-foreground block">BASE DMG</span>
                  <span className="text-accent font-bold text-sm font-display">{derivedDamage}</span>
                </div>
                <div className="bg-game-slot/80 border border-game-slot-border p-1.5">
                  <span className="text-[7px] text-muted-foreground block">SPEED</span>
                  <span className="text-accent font-bold text-sm font-display">{derivedSpeed}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Trait Allocation */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-accent font-display font-bold text-sm">ALLOCATE TRAIT POINTS</label>
              <span className={`text-sm font-bold font-display ${pointsLeft > 0 ? 'text-accent' : 'text-rarity-advanced'}`}>
                {pointsLeft} points left
              </span>
            </div>

            <div className="space-y-2">
              {TRAIT_CATEGORIES.map(trait => (
                <div key={trait} className="flex items-center gap-3 bg-game-slot border border-game-slot-border p-2.5">
                  <span className="text-xs font-bold text-foreground w-24">{trait.toUpperCase()}</span>
                  <button onClick={() => adjustTrait(trait, -1)} disabled={traitPoints[trait] <= 0}
                    className="w-6 h-6 flex items-center justify-center bg-game-slot-border hover:bg-primary disabled:opacity-30 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex gap-0.5">
                    {Array.from({ length: MAX_PER_TRAIT }).map((_, i) => (
                      <div key={i} className={`w-5 h-5 border transition-all ${
                        i < traitPoints[trait] ? 'bg-accent border-accent' : 'bg-game-slot border-game-slot-border'
                      }`} />
                    ))}
                  </div>
                  <button onClick={() => adjustTrait(trait, 1)} disabled={traitPoints[trait] >= MAX_PER_TRAIT || pointsLeft <= 0}
                    className="w-6 h-6 flex items-center justify-center bg-game-slot-border hover:bg-primary disabled:opacity-30 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="text-[9px] text-muted-foreground w-6 text-right">{traitPoints[trait]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Final Summary */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-[100px] h-[140px] bg-game-slot border-2 border-accent overflow-hidden flex-shrink-0">
                <img src={portrait.img} alt={portrait.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-accent">{characterName}</h3>
                <p className="text-primary text-xs font-bold">{archetype.title}</p>
                <p className="text-accent text-[9px] font-bold mt-1">Class: {statClass.acronym}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {archetype.traits.map(t => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/30 font-bold">{t}</span>
                  ))}
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {archetype.skills.map(s => (
                    <span key={s} className="text-[7px] px-1 py-0.5 bg-primary/20 text-primary border border-primary/30 font-bold">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Class Stats Summary */}
            <div className="bg-game-slot/60 border-2 border-game-slot-border p-3"
              style={{ borderImage: 'linear-gradient(180deg, hsl(var(--accent)/0.5), hsl(var(--primary)/0.3)) 1' }}>
              <span className="text-[9px] text-accent font-display font-bold tracking-widest block mb-2">{statClass.acronym}</span>
              <div className={`grid gap-1 ${statClass.attributes.length <= 5 ? 'grid-cols-5' : 'grid-cols-3 md:grid-cols-6'}`}>
                {statClass.attributes.map(attr => (
                  <div key={attr.key} className="bg-game-slot/80 border border-game-slot-border p-1 text-center">
                    <span className="text-accent font-display font-bold text-sm block">{attr.icon}</span>
                    <span className="text-foreground font-bold text-base font-display">{currentValues[attr.key] || 1}</span>
                    <span className="text-[5px] text-muted-foreground block">{attr.name.slice(0, 4).toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traits Summary */}
            <div className="bg-game-slot/60 border border-game-slot-border p-3">
              <span className="text-[9px] text-primary font-bold block mb-1.5">TRAIT POINTS</span>
              <div className="grid grid-cols-5 gap-1.5">
                {TRAIT_CATEGORIES.map(trait => (
                  <div key={trait} className="text-center bg-game-slot/80 border border-game-slot-border p-1">
                    <span className="text-[7px] text-muted-foreground block">{trait.toUpperCase()}</span>
                    <span className="text-accent font-bold text-sm font-display">{traitPoints[trait]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vitals Preview */}
            <div className="bg-game-slot/60 border border-game-slot-border p-3">
              <span className="text-[9px] text-primary font-bold block mb-1.5">STARTING VITALS</span>
              <div className="grid grid-cols-4 gap-1.5 text-center">
                {[
                  { label: 'Health', val: derivedHealth, icon: '♥' },
                  { label: 'Energy', val: 100, icon: '≡' },
                  { label: 'Hunger', val: 100, icon: '∞' },
                  { label: 'Thirst', val: 100, icon: '◈' },
                  { label: 'Sleep', val: 100, icon: '◑' },
                  { label: 'Morale', val: 75, icon: '★' },
                  { label: 'Hygiene', val: 80, icon: '◇' },
                  { label: 'Damage', val: derivedDamage, icon: '⚔' },
                ].map(v => (
                  <div key={v.label} className="bg-game-slot/80 border border-game-slot-border p-1">
                    <span className="text-primary font-display text-xs">{v.icon}</span>
                    <span className="text-[6px] text-muted-foreground block">{v.label.toUpperCase()}</span>
                    <span className="text-foreground font-bold text-xs font-display">{v.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Starting Gear */}
            <div className="bg-game-slot/60 border border-game-slot-border p-3">
              <span className="text-[9px] text-primary font-bold block mb-1.5">STARTING GEAR</span>
              <div className="grid grid-cols-3 gap-1 text-[8px] text-foreground/70">
                <span>⌁ Percussion Revolver</span>
                <span>╪ Single-Shot Carbine</span>
                <span>⌐ Stetson Hat</span>
                <span>⊥ Work Boots</span>
                <span>⊶ Plain Leather Belt</span>
                <span>∏ Denim Jeans</span>
                <span>⊤ Cotton Work Shirt</span>
                <span>• Revolver Cartridges</span>
                <span>• Rifle Rounds</span>
              </div>
            </div>

            {/* Reputation Preview */}
            <div className="bg-game-slot/60 border border-game-slot-border p-3">
              <span className="text-[9px] text-primary font-bold block mb-1.5">STARTING REPUTATION</span>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
                <div className="bg-game-slot/80 border border-game-slot-border p-1">
                  <span className="text-muted-foreground block text-[7px]">WANTED</span>
                  <span className="text-foreground">☆☆☆☆☆</span>
                </div>
                <div className="bg-game-slot/80 border border-game-slot-border p-1">
                  <span className="text-muted-foreground block text-[7px]">LAWFULNESS</span>
                  <span className="text-foreground font-bold">Neutral</span>
                </div>
                <div className="bg-game-slot/80 border border-game-slot-border p-1">
                  <span className="text-muted-foreground block text-[7px]">HONOR</span>
                  <span className="text-foreground font-bold">50</span>
                </div>
              </div>
            </div>

            {/* Backstory */}
            <div className="bg-game-slot/40 border border-game-slot-border p-3">
              <span className="text-[9px] text-accent font-bold block mb-1">◈ BACKSTORY</span>
              <p className="text-[9px] text-foreground/70 leading-relaxed italic line-clamp-3">"{archetype.backstory}"</p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={() => setStep((step - 1) as any)}
              className="flex-1 py-2.5 bg-game-slot-border border border-game-slot text-foreground font-display font-bold text-sm hover:bg-secondary transition-colors flex items-center justify-center gap-1">
              <ChevronLeft className="w-4 h-4" /> BACK
            </button>
          )}
          {step < totalSteps ? (
            <button onClick={() => setStep((step + 1) as any)} disabled={!canProceed}
              className="flex-1 py-2.5 bg-primary border border-accent text-primary-foreground font-display font-bold text-sm hover:bg-accent transition-colors disabled:opacity-40 flex items-center justify-center gap-1">
              NEXT <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleComplete}
              className="flex-1 py-2.5 bg-accent border border-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-colors flex items-center justify-center gap-1">
              ★ BEGIN YOUR LEGEND
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
