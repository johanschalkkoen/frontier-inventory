import { useState, useMemo } from 'react';
import { characters } from '@/data/characters';
import { archetypes, TRAIT_CATEGORIES, TOTAL_TRAIT_POINTS, MAX_PER_TRAIT, type TraitCategory } from '@/data/archetypes';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';

interface CharacterCreationProps {
  onComplete: (data: {
    characterName: string;
    archetypeId: string;
    portraitId: string;
    traitPoints: Record<string, number>;
  }) => void;
}

export function CharacterCreation({ onComplete }: CharacterCreationProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [characterName, setCharacterName] = useState('');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [selectedArchetype, setSelectedArchetype] = useState(archetypes.find(a => a.gender === 'male')!.id);
  const [selectedPortrait, setSelectedPortrait] = useState(characters.find(c => c.gender === 'male')!.id);
  const [traitPoints, setTraitPoints] = useState<Record<TraitCategory, number>>(
    Object.fromEntries(TRAIT_CATEGORIES.map(t => [t, 0])) as Record<TraitCategory, number>
  );

  const archetype = archetypes.find(a => a.id === selectedArchetype)!;
  const portrait = characters.find(c => c.id === selectedPortrait)!;
  const pointsUsed = Object.values(traitPoints).reduce((s, v) => s + v, 0);
  const pointsLeft = TOTAL_TRAIT_POINTS - pointsUsed;

  // Filter portraits and archetypes by selected gender
  const genderPortraits = useMemo(() =>
    characters.filter(c => c.gender === selectedGender),
    [selectedGender]
  );

  const genderArchetypes = useMemo(() =>
    archetypes.filter(a => a.gender === selectedGender),
    [selectedGender]
  );

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

  const handleComplete = () => {
    if (!characterName.trim()) return;
    onComplete({
      characterName: characterName.trim(),
      archetypeId: selectedArchetype,
      portraitId: selectedPortrait,
      traitPoints: traitPoints,
    });
  };

  const canProceed = step === 1 ? characterName.trim().length > 0 : true;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl bg-game-container border-4 border-game-slot shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6">
        <h1 className="font-display text-2xl font-black text-accent tracking-wider text-center mb-1 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
          Create Your Legend
        </h1>
        <p className="text-center text-muted-foreground text-xs mb-5">
          Step {step} of 3 — {step === 1 ? 'Name & Portrait' : step === 2 ? 'Choose Your Path' : 'Allocate Traits'}
        </p>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`w-16 h-1 rounded-sm transition-all ${s <= step ? 'bg-accent' : 'bg-game-slot-border'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-accent font-display font-bold text-sm mb-2">CHARACTER NAME</label>
              <input
                type="text"
                value={characterName}
                onChange={e => setCharacterName(e.target.value.slice(0, 24))}
                placeholder="Enter your frontier name..."
                className="w-full bg-game-slot border-2 border-game-slot-border text-foreground px-3 py-2.5 font-body text-sm focus:outline-none focus:border-accent transition-colors placeholder:text-muted-foreground"
                autoFocus
              />
              <span className="text-[9px] text-muted-foreground mt-1 block">{characterName.length}/24</span>
            </div>

            {/* Gender Selector */}
            <div>
              <label className="block text-accent font-display font-bold text-sm mb-2">GENDER</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleGenderChange('male')}
                  className={`flex-1 py-2.5 text-sm font-bold font-display border-2 transition-all ${
                    selectedGender === 'male'
                      ? 'bg-primary border-accent text-primary-foreground'
                      : 'bg-game-slot-border border-game-slot text-foreground hover:bg-secondary'
                  }`}
                >
                  ♂ MALE
                </button>
                <button
                  onClick={() => handleGenderChange('female')}
                  className={`flex-1 py-2.5 text-sm font-bold font-display border-2 transition-all ${
                    selectedGender === 'female'
                      ? 'bg-primary border-accent text-primary-foreground'
                      : 'bg-game-slot-border border-game-slot text-foreground hover:bg-secondary'
                  }`}
                >
                  ♀ FEMALE
                </button>
              </div>
            </div>

            {/* Portrait Picker - filtered by gender */}
            <div>
              <label className="block text-accent font-display font-bold text-sm mb-2">CHOOSE YOUR LOOK</label>
              <div className="flex gap-4 items-center justify-center">
                <div className="relative w-[140px] h-[200px] bg-game-slot border-2 border-accent overflow-hidden">
                  <img src={portrait.img} alt={portrait.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                {genderPortraits.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedPortrait(c.id)}
                    className={`w-12 h-12 border-2 overflow-hidden transition-all ${
                      c.id === selectedPortrait
                        ? 'border-accent shadow-[0_0_8px_hsl(var(--game-gold)/0.5)]'
                        : 'border-game-slot-border opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-accent font-display font-bold text-sm mb-2">
              CHOOSE YOUR ARCHETYPE ({selectedGender === 'male' ? 'MALE' : 'FEMALE'})
            </label>
            <div className="grid grid-cols-2 gap-3">
              {genderArchetypes.map(a => (
                <button
                  key={a.id}
                  onClick={() => setSelectedArchetype(a.id)}
                  className={`text-left p-3 border-2 transition-all ${
                    a.id === selectedArchetype
                      ? 'border-accent bg-game-slot shadow-[0_0_12px_hsl(var(--game-gold)/0.3)]'
                      : 'border-game-slot-border bg-game-slot/50 hover:border-primary'
                  }`}
                >
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

            {/* Selected archetype details */}
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

        {step === 3 && (
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
                  <button
                    onClick={() => adjustTrait(trait, -1)}
                    disabled={traitPoints[trait] <= 0}
                    className="w-6 h-6 flex items-center justify-center bg-game-slot-border hover:bg-primary disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <div className="flex gap-0.5">
                    {Array.from({ length: MAX_PER_TRAIT }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-5 h-5 border transition-all ${
                          i < traitPoints[trait]
                            ? 'bg-accent border-accent'
                            : 'bg-game-slot border-game-slot-border'
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => adjustTrait(trait, 1)}
                    disabled={traitPoints[trait] >= MAX_PER_TRAIT || pointsLeft <= 0}
                    className="w-6 h-6 flex items-center justify-center bg-game-slot-border hover:bg-primary disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <span className="text-[9px] text-muted-foreground w-6 text-right">{traitPoints[trait]}</span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-game-slot border border-game-slot-border p-3">
              <h3 className="text-accent font-display font-bold text-xs mb-2">CHARACTER SUMMARY</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                <span className="text-muted-foreground">Name:</span>
                <span className="text-foreground font-bold">{characterName}</span>
                <span className="text-muted-foreground">Gender:</span>
                <span className="text-foreground font-bold">{selectedGender === 'male' ? 'Male' : 'Female'}</span>
                <span className="text-muted-foreground">Archetype:</span>
                <span className="text-foreground font-bold">{archetype.title}</span>
                <span className="text-muted-foreground">Traits:</span>
                <span className="text-foreground">{archetype.traits.join(', ')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              onClick={() => setStep((step - 1) as 1 | 2 | 3)}
              className="flex-1 py-2.5 bg-game-slot-border border border-game-slot text-foreground font-display font-bold text-sm hover:bg-secondary transition-colors flex items-center justify-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> BACK
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep((step + 1) as 1 | 2 | 3)}
              disabled={!canProceed}
              className="flex-1 py-2.5 bg-primary border border-accent text-primary-foreground font-display font-bold text-sm hover:bg-accent transition-colors disabled:opacity-40 flex items-center justify-center gap-1"
            >
              NEXT <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 py-2.5 bg-accent border border-accent text-accent-foreground font-display font-bold text-sm hover:bg-primary transition-colors flex items-center justify-center gap-1"
            >
              🤠 BEGIN YOUR LEGEND
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
