import G from './gifAssets';

export type Difficulty = 'Iniciante' | 'Intermediário' | 'Avançado';
export type MuscleGroup = 'Glúteos' | 'Pernas' | 'Cardio';
export type ExerciseCategory = 'Ativação' | 'Compostos' | 'Isolados' | 'Abduções' | 'Finalizadores';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  category: ExerciseCategory;
  secondaryMuscles: string[];
  difficulty: Difficulty;
  equipment: string;
  gifUrl: any;
  instructions: string[];
  tips: string[];
  defaultSets: number;
  defaultReps: string;
  defaultRest: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// TODOS OS EXERCÍCIOS
// ─────────────────────────────────────────────────────────────────────────────
export const exercises: Exercise[] = [
  { id: 'ex01', name: 'Ponte de Glúteos', muscleGroup: 'Glúteos', category: 'Ativação',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.ponte_gluteos,
    instructions: ['Deite de costas, joelhos flexionados', 'Eleve o quadril contraindo os glúteos', 'Segure no topo e desça controlado'],
    tips: ['Pés paralelos na largura do quadril', 'Contraia o glúteo antes de subir'],
    defaultSets: 3, defaultReps: '15-20', defaultRest: 45 },

  { id: 'ex02', name: 'Elevação Pélvica', muscleGroup: 'Glúteos', category: 'Ativação',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.elevacao_pelvica,
    instructions: ['Deite de costas, joelhos dobrados', 'Empurre o quadril para cima com força', 'Contraia no topo por 1-2s'],
    tips: ['Mantenha o core firme', 'Não arqueje a lombar em excesso'],
    defaultSets: 3, defaultReps: '15-20', defaultRest: 45 },

  { id: 'ex03', name: 'Pulsos da Ponte do Quadril', muscleGroup: 'Glúteos', category: 'Ativação',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.pulso_ponte_quadril,
    instructions: ['Eleve o quadril na posição de ponte', 'Faça pequenos pulsos para cima', 'Mantenha a tensão constante no glúteo'],
    tips: ['Amplitude pequena e rápida', 'Sinta a queimação no glúteo'],
    defaultSets: 3, defaultReps: '20-30', defaultRest: 30 },

  { id: 'ex04', name: 'Contração de Quadril', muscleGroup: 'Glúteos', category: 'Ativação',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.contracao_quadril,
    instructions: ['Deite de costas com joelhos flexionados', 'Contraia o glúteo sem elevar o quadril', 'Segure 2-3s e relaxe'],
    tips: ['Ótimo para ativação pré-treino', 'Sinta o glúteo antes de iniciar'],
    defaultSets: 2, defaultReps: '20-30', defaultRest: 30 },

  { id: 'ex05', name: 'Abdução de Pernas Deitada', muscleGroup: 'Glúteos', category: 'Abduções',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.abducao_pernas_deitada,
    instructions: ['Deite de lado com corpo alinhado', 'Eleve a perna de cima mantendo-a reta', 'Retorne de forma controlada'],
    tips: ['Não gire o quadril', 'Foco no glúteo médio'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  { id: 'ex06', name: 'Abdução de Quadril', muscleGroup: 'Glúteos', category: 'Abduções',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.abducao_quadril,
    instructions: ['Em pé com apoio', 'Eleve a perna lateralmente', 'Contraia o glúteo médio no topo'],
    tips: ['Movimento lento e controlado', 'Evite inclinar o tronco'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  { id: 'ex07', name: 'Abdução Flexionado', muscleGroup: 'Glúteos', category: 'Abduções',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.abducao_flexionado,
    instructions: ['Deite de lado com joelhos flexionados', 'Abra o joelho de cima como uma concha', 'Retorne controlado'],
    tips: ['Pés juntos o tempo todo', 'Não deixe o quadril rolar'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  { id: 'ex08', name: 'Glúteo Abduzido', muscleGroup: 'Glúteos', category: 'Abduções',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.gluteo_abduzido,
    instructions: ['Em pé com apoio', 'Eleve a perna lateralmente com pé em flexão', 'Contraia o glúteo médio no topo'],
    tips: ['Foco na lateral do bumbum', 'Movimento lento'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  { id: 'ex09', name: 'Chute de Burro', muscleGroup: 'Glúteos', category: 'Isolados',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.chute_de_burro,
    instructions: ['Apoie em 4 pontos', 'Chute uma perna para trás e para cima', 'Contraia o glúteo no topo'],
    tips: ['Joelho pode ficar flexionado', 'Não arqueje a lombar'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  { id: 'ex10', name: 'Donkey Kick', muscleGroup: 'Glúteos', category: 'Isolados',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.donkey_kick,
    instructions: ['Em 4 apoios, joelho a 90°', 'Empurre o calcanhar para o teto', 'Contraia no topo e retorne'],
    tips: ['Mantenha o core ativado', 'Quadril nivelado'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  { id: 'ex11', name: 'Hidrante', muscleGroup: 'Glúteos', category: 'Abduções',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.hidrante,
    instructions: ['Em 4 apoios', 'Eleve o joelho lateralmente a 90°', 'Contraia no topo e desça'],
    tips: ['Imite um cachorro levantando a perna', 'Não gire o tronco'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  { id: 'ex12', name: 'Glúteos 4 Apoios', muscleGroup: 'Glúteos', category: 'Isolados',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.gluteos_quatro_apoios,
    instructions: ['Em 4 apoios, costas retas', 'Estenda a perna para trás', 'Contraia no topo'],
    tips: ['Core ativado', 'Movimento controlado'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  { id: 'ex13', name: 'Extensão de Perna Ajoelhada', muscleGroup: 'Glúteos', category: 'Isolados',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.extensao_perna_ajoelhada,
    instructions: ['Ajoelhe no chão', 'Estenda uma perna para trás e para cima', 'Retorne sem tocar o joelho no chão'],
    tips: ['Quadril nivelado', 'Contração máxima no topo'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 45 },

  { id: 'ex14', name: 'Extensão de Quadril em Pé', muscleGroup: 'Glúteos', category: 'Isolados',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.extensao_quadril_pe,
    instructions: ['Em pé, segure um apoio', 'Leve uma perna para trás com extensão do quadril', 'Contraia o glúteo no topo'],
    tips: ['Tronco levemente inclinado', 'Mantenha perna ativa estendida'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  { id: 'ex15', name: 'Retrocesso de Glúteo em Pé', muscleGroup: 'Glúteos', category: 'Isolados',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.retrocesso_gluteo_pe,
    instructions: ['Em pé com apoio', 'Recue a perna para trás com joelho dobrado', 'Contraia o glúteo e volte'],
    tips: ['Quadril não gira', 'Ativação intensa no glúteo'],
    defaultSets: 3, defaultReps: '15-20 cada', defaultRest: 45 },

  // ── INTERMEDIÁRIO ─────────────────────────────────────────────────────────
  { id: 'ex16', name: 'Hip Thrust', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Banco ou suporte',
    gifUrl: G.hip_thrust,
    instructions: ['Apoie as costas num banco', 'Barra ou peso sobre o quadril', 'Empurre o quadril para cima contraindo o glúteo'],
    tips: ['O exercício mais eficaz para glúteos', 'Joelhos a 90° no topo'],
    defaultSets: 4, defaultReps: '10-15', defaultRest: 60 },

  { id: 'ex17', name: 'Elevação Pélvica Uni', muscleGroup: 'Glúteos', category: 'Ativação',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Sem equipamento',
    gifUrl: G.elevacao_pelvica_uni,
    instructions: ['Deite de costas, uma perna estendida', 'Eleve o quadril com a perna de apoio', 'Segure no topo e desça'],
    tips: ['Corrige assimetrias', 'Faça os dois lados'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 45 },

  { id: 'ex18', name: 'Ponte com Extensão de Perna Alternada', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas', 'Core'], difficulty: 'Intermediário', equipment: 'Sem equipamento',
    gifUrl: G.ponte_extensao_alternada,
    instructions: ['Na posição de ponte elevada', 'Estenda uma perna alternando os lados', 'Mantenha o quadril nivelado'],
    tips: ['Não deixe o quadril cair', 'Core contraído'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 45 },

  { id: 'ex19', name: 'Agachamento Livre', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.agachamento_livre,
    instructions: ['Pés na largura dos ombros', 'Agache até as coxas paralelas ao chão', 'Suba empurrando com os calcanhares'],
    tips: ['Joelhos na direção dos pés', 'Olhe para frente'],
    defaultSets: 4, defaultReps: '15-20', defaultRest: 60 },

  { id: 'ex20', name: 'Agachamento com Halteres', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Halteres',
    gifUrl: G.agachamento_halteres,
    instructions: ['Segure halteres ao lado do corpo', 'Agache com controle', 'Suba empurrando os calcanhares'],
    tips: ['Costas retas', 'Progrida o peso gradualmente'],
    defaultSets: 4, defaultReps: '12-15', defaultRest: 60 },

  { id: 'ex21', name: 'Agachamento Sumô', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.agachamento_sumo,
    instructions: ['Pés bem afastados, pontas para fora', 'Desça profundo no sumô', 'Empurre com os calcanhares para subir'],
    tips: ['Mais interno e glúteo', 'Joelhos seguem os pés'],
    defaultSets: 4, defaultReps: '15-20', defaultRest: 60 },

  { id: 'ex22', name: 'Goblet Squat', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas', 'Core'], difficulty: 'Intermediário', equipment: 'Halter ou kettlebell',
    gifUrl: G.goblet_squat,
    instructions: ['Segure peso no peito com as duas mãos', 'Agache profundo mantendo o tronco ereto', 'Empurre com os calcanhares'],
    tips: ['Cotovelos afastam os joelhos na descida', 'Ótimo para mobilidade'],
    defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },

  { id: 'ex23', name: 'Agachamento com Abdução', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Sem equipamento',
    gifUrl: G.agachamento_abducao,
    instructions: ['Agache normalmente', 'Ao subir, eleve uma perna lateralmente', 'Alterne os lados'],
    tips: ['Ativa glúteo médio no momento da abdução', 'Mantenha equilíbrio'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 60 },

  { id: 'ex24', name: 'Afundo Alternado', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Sem equipamento',
    gifUrl: G.afundo_alternado,
    instructions: ['Em pé, dê um passo para frente', 'Desça o joelho de trás em direção ao chão', 'Volte e alterne as pernas'],
    tips: ['Passo largo para mais glúteo', 'Tronco ereto'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 60 },

  { id: 'ex25', name: 'Afundo Reverso', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Sem equipamento',
    gifUrl: G.afundo_reverso,
    instructions: ['Em pé, dê um passo para trás', 'Desça o joelho traseiro', 'Volte e alterne'],
    tips: ['Menos impacto nos joelhos', 'Mais foco no glúteo'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 60 },

  { id: 'ex26', name: 'Reverse Lunge', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Sem equipamento',
    gifUrl: G.reverse_lunge,
    instructions: ['Passo para trás controlado', 'Desça até o joelho quase tocar o chão', 'Empurre de volta com o pé da frente'],
    tips: ['Joelho da frente sobre o tornozelo', 'Tronco vertical'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 60 },

  { id: 'ex27', name: 'Step-Up', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Banco ou step',
    gifUrl: G.step_up,
    instructions: ['Coloque um pé no step', 'Suba empurrando com o calcanhar', 'Desça controlado e alterne'],
    tips: ['Quanto mais alto o step, mais glúteo', 'Não apoie o pé de trás'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 60 },

  { id: 'ex28', name: 'Subida Unilateral', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Step ou banco',
    gifUrl: G.subida_unilateral,
    instructions: ['Um pé no step, outro no ar', 'Suba com apenas uma perna', 'Desça controlado'],
    tips: ['Exige equilíbrio e força', 'Ativa glúteo intensamente'],
    defaultSets: 3, defaultReps: '10-12 cada', defaultRest: 60 },

  { id: 'ex29', name: 'Curtsy Lunge', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Sem equipamento',
    gifUrl: G.curtsy_lunge,
    instructions: ['Dê um passo diagonal para trás', 'Desça como uma reverência', 'Volte e alterne os lados'],
    tips: ['Excelente para glúteo médio', 'Joelho da frente alinhado'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 60 },

  { id: 'ex30', name: 'Caminhada Bandida', muscleGroup: 'Glúteos', category: 'Abduções',
    secondaryMuscles: ['Pernas'], difficulty: 'Intermediário', equipment: 'Elástico (opcional)',
    gifUrl: G.caminhada_bandida,
    instructions: ['Agache levemente com pés afastados', 'Dê passos laterais mantendo a tensão', 'Alterne as direções'],
    tips: ['Glúteo médio em chamas', 'Mantenha o nível baixo'],
    defaultSets: 3, defaultReps: '10-12 cada lado', defaultRest: 45 },

  // ── AVANÇADO ──────────────────────────────────────────────────────────────
  { id: 'ex31', name: 'Bulgarian Split Squat', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Avançado', equipment: 'Banco',
    gifUrl: G.bulgarian_split_squat,
    instructions: ['Pé traseiro num banco atrás', 'Desça com a perna da frente', 'Joelho traseiro próximo ao chão'],
    tips: ['Passo longo = mais glúteo', 'Exige mobilidade'],
    defaultSets: 4, defaultReps: '10-12 cada', defaultRest: 90 },

  { id: 'ex32', name: 'Deadlift Romeno', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas', 'Lombar'], difficulty: 'Avançado', equipment: 'Barra ou halteres',
    gifUrl: G.deadlift_romeno,
    instructions: ['Pés na largura dos quadris', 'Incline o tronco mantendo as costas retas', 'Sinta o alongamento nos isquiotibiais'],
    tips: ['Barra próxima ao corpo', 'Empurre o quadril para trás'],
    defaultSets: 4, defaultReps: '10-12', defaultRest: 90 },

  { id: 'ex33', name: 'Deadlift Unilateral', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas', 'Core'], difficulty: 'Avançado', equipment: 'Halter',
    gifUrl: G.deadlift_unilateral,
    instructions: ['Em pé sobre uma perna', 'Incline o tronco e leve o peso ao chão', 'Volte usando o glúteo de apoio'],
    tips: ['Melhora equilíbrio e simetria', 'Core firme'],
    defaultSets: 3, defaultReps: '10-12 cada', defaultRest: 90 },

  { id: 'ex34', name: 'Bom Dia', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Lombar', 'Pernas'], difficulty: 'Avançado', equipment: 'Barra ou sem',
    gifUrl: G.bom_dia,
    instructions: ['Barra nas costas ou mãos na nuca', 'Incline o tronco para frente com costas retas', 'Volte contraindo o glúteo'],
    tips: ['Não curve a lombar', 'Quadril recua ao descer'],
    defaultSets: 3, defaultReps: '10-12', defaultRest: 90 },

  { id: 'ex35', name: 'Agachamento Unilateral', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas', 'Core'], difficulty: 'Avançado', equipment: 'Sem equipamento',
    gifUrl: G.agachamento_unilateral,
    instructions: ['Em pé sobre uma perna', 'Agache controlado', 'Use os braços para equilíbrio'],
    tips: ['Exige muita força e equilíbrio', 'Progrida gradualmente'],
    defaultSets: 3, defaultReps: '8-10 cada', defaultRest: 90 },

  { id: 'ex36', name: 'Agachamento Lateral', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Avançado', equipment: 'Sem equipamento',
    gifUrl: G.agachamento_lateral,
    instructions: ['Pés bem afastados', 'Desça para um lado dobrando o joelho', 'Perna contrária estendida'],
    tips: ['Excelente para glúteo médio', 'Aumente a amplitude'],
    defaultSets: 3, defaultReps: '10-12 cada', defaultRest: 60 },

  { id: 'ex37', name: 'Agachamento para Elevação Lateral', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Avançado', equipment: 'Sem equipamento',
    gifUrl: G.agachamento_elevacao_lateral,
    instructions: ['Agache normalmente', 'Ao subir eleve a perna lateralmente com força', 'Alterne os lados'],
    tips: ['Combina força e abdução', 'Ativação dupla do glúteo'],
    defaultSets: 3, defaultReps: '12-15 cada', defaultRest: 60 },

  { id: 'ex38', name: 'Step-Up Explosivo', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas', 'Cardio'], difficulty: 'Avançado', equipment: 'Step ou banco',
    gifUrl: G.step_up_explosivo,
    instructions: ['Suba o step com força explosiva', 'Salte levemente no topo', 'Desça controlado'],
    tips: ['Potência + glúteo', 'Mantenha o aterrisamento suave'],
    defaultSets: 3, defaultReps: '10-12 cada', defaultRest: 60 },

  { id: 'ex39', name: 'Salto Flexionado', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas', 'Cardio'], difficulty: 'Avançado', equipment: 'Sem equipamento',
    gifUrl: G.salto_flexionado,
    instructions: ['Agache e salte com força', 'Aterrisse suavemente voltando ao agachamento', 'Sem pausa'],
    tips: ['Alto impacto, melhora potência', 'Aterrissagem suave nos joelhos'],
    defaultSets: 3, defaultReps: '10-15', defaultRest: 60 },

  { id: 'ex40', name: 'Salto no Caixote', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas', 'Cardio'], difficulty: 'Avançado', equipment: 'Caixote ou plataforma',
    gifUrl: G.salto_caixote,
    instructions: ['Agache levemente e salte no caixote', 'Aterrisse com os dois pés simultaneamente', 'Desça com controle'],
    tips: ['Foco na explosão', 'Altura progressiva'],
    defaultSets: 3, defaultReps: '8-10', defaultRest: 90 },

  { id: 'ex41', name: 'Sumô Estático com Flexão Plantar', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Avançado', equipment: 'Sem equipamento',
    gifUrl: G.sumo_flexao_plantar,
    instructions: ['Pés bem afastados em sumô', 'Mantenha o agachamento', 'Eleve os calcanhares alternadamente'],
    tips: ['Queima profunda no glúteo', 'Não saia da posição baixa'],
    defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },

  { id: 'ex42', name: 'Sumô Pés em Abdução', muscleGroup: 'Glúteos', category: 'Compostos',
    secondaryMuscles: ['Pernas'], difficulty: 'Avançado', equipment: 'Sem equipamento',
    gifUrl: G.sumo_abducao,
    instructions: ['Pés muito afastados, pontas para fora', 'Agache profundo em sumô', 'Suba empurrando com os calcanhares'],
    tips: ['Máxima ativação interna', 'Joelhos seguem os pés'],
    defaultSets: 4, defaultReps: '15-20', defaultRest: 60 },

  // ── FROG PUMPS (usado em casa e desafio 30d) ──────────────────────────────
  { id: 'ex43', name: 'Frog Pumps', muscleGroup: 'Glúteos', category: 'Ativação',
    secondaryMuscles: [], difficulty: 'Iniciante', equipment: 'Sem equipamento',
    gifUrl: G.frog_pumps,
    instructions: ['Deite de costas, plantas dos pés juntas', 'Eleve o quadril contraindo o glúteo', 'Faça pulsos rápidos'],
    tips: ['Excelente ativação do glúteo', 'Sinta a queimação'],
    defaultSets: 3, defaultReps: '20-30', defaultRest: 30 },
];

// ─────────────────────────────────────────────────────────────────────────────
// PLANOS DE TREINO
// ─────────────────────────────────────────────────────────────────────────────
export type PlanType = 'workout' | 'challenge';

export interface WorkoutPlan {
  id: string;
  name: string;
  emoji: string;
  description: string;
  objective: string;
  duration: string;
  level: Difficulty;
  daysPerWeek: number;
  category: string;
  color: string;
  type: PlanType;
  exerciseIds: string[];
}

export const workoutPlans: WorkoutPlan[] = [
  // ── TREINOS ───────────────────────────────────────────────────────────────
  {
    id: 'plan_zero',
    name: 'Bumbum do Zero',
    emoji: '🍑',
    description: 'Ativação muscular, aprender os movimentos e criar consistência.',
    objective: 'Ativação muscular, aprender os movimentos e criar consistência.',
    duration: '4 semanas',
    level: 'Iniciante',
    daysPerWeek: 3,
    category: 'Iniciante',
    color: '#FF2D6B',
    type: 'workout',
    exerciseIds: ['ex01','ex02','ex03','ex04','ex05','ex06','ex07','ex08','ex09','ex10','ex11','ex12','ex13','ex14','ex15'],
  },
  {
    id: 'plan_max',
    name: 'Glúteo Máximo',
    emoji: '🔥',
    description: 'Aumentar volume e firmeza com exercícios compostos e de isolamento.',
    objective: 'Aumentar volume e firmeza.',
    duration: '8 semanas',
    level: 'Intermediário',
    daysPerWeek: 4,
    category: 'Intermediário',
    color: '#FF2D6B',
    type: 'workout',
    exerciseIds: ['ex16','ex17','ex18','ex19','ex20','ex21','ex22','ex23','ex24','ex25','ex26','ex27','ex28','ex29','ex30'],
  },
  {
    id: 'plan_avancado',
    name: 'Glúteo Máximo Avançado',
    emoji: '👑',
    description: 'Máxima ativação dos glúteos com movimentos complexos e explosivos.',
    objective: 'Máxima ativação dos glúteos.',
    duration: '12 semanas',
    level: 'Avançado',
    daysPerWeek: 5,
    category: 'Avançado',
    color: '#FF2D6B',
    type: 'workout',
    exerciseIds: ['ex31','ex32','ex33','ex34','ex35','ex36','ex37','ex38','ex39','ex40','ex41','ex42'],
  },
  {
    id: 'plan_casa',
    name: 'Bumbum em Casa',
    emoji: '🏠',
    description: 'Treino completo de glúteos sem equipamentos, em qualquer lugar.',
    objective: 'Sem equipamentos.',
    duration: '4 semanas',
    level: 'Iniciante',
    daysPerWeek: 3,
    category: 'Casa',
    color: '#FF2D6B',
    type: 'workout',
    exerciseIds: ['ex01','ex02','ex43','ex10','ex11','ex12','ex09','ex05','ex14','ex19','ex21','ex24','ex26','ex27','ex30'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DESAFIOS
// ─────────────────────────────────────────────────────────────────────────────
export interface ChallengeWeek {
  week: number;
  label: string;
  exerciseIds: string[];
}

export interface ChallengeMonth {
  month: number;
  label: string;
  description: string;
  exerciseIds: string[];
}

export interface Challenge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  totalDays: number;
  color: string;
  type: 'challenge';
  weeks?: ChallengeWeek[];
  months?: ChallengeMonth[];
}

export const challenges: Challenge[] = [
  {
    id: 'ch30',
    name: 'Desafio 30 Dias',
    emoji: '🎯',
    description: 'Um mês de foco total para criar o hábito e sentir a diferença.',
    totalDays: 30,
    color: '#FF2D6B',
    type: 'challenge',
    weeks: [
      { week: 1, label: 'Semana 1 — Base', exerciseIds: ['ex01','ex04','ex11','ex09'] },
      { week: 2, label: 'Semana 2 — Ativação', exerciseIds: ['ex02','ex10','ex12','ex05'] },
      { week: 3, label: 'Semana 3 — Força', exerciseIds: ['ex19','ex21','ex24','ex27'] },
      { week: 4, label: 'Semana 4 — Intensidade', exerciseIds: ['ex16','ex26','ex30','ex43'] },
    ],
  },
  {
    id: 'ch60',
    name: 'Desafio 60 Dias',
    emoji: '🚀',
    description: 'Dois meses para transformar o bumbum com progressão gradual.',
    totalDays: 60,
    color: '#FF2D6B',
    type: 'challenge',
    months: [
      {
        month: 1,
        label: 'Mês 1 — Bumbum do Zero',
        description: 'Todos os exercícios do Bumbum do Zero.',
        exerciseIds: ['ex01','ex02','ex03','ex04','ex05','ex06','ex07','ex08','ex09','ex10','ex11','ex12','ex13','ex14','ex15'],
      },
      {
        month: 2,
        label: 'Mês 2 — Evolução',
        description: 'Adicionar exercícios intermediários ao repertório.',
        exerciseIds: ['ex16','ex22','ex29','ex27','ex26','ex20','ex30'],
      },
    ],
  },
  {
    id: 'ch90',
    name: 'Desafio 90 Dias',
    emoji: '👑',
    description: 'A transformação completa em 3 meses. Do zero ao avançado.',
    totalDays: 90,
    color: '#FF2D6B',
    type: 'challenge',
    months: [
      {
        month: 1,
        label: 'Dias 1–30 — Bumbum do Zero',
        description: 'Treinos do Bumbum do Zero.',
        exerciseIds: ['ex01','ex02','ex03','ex04','ex05','ex06','ex07','ex08','ex09','ex10','ex11','ex12','ex13','ex14','ex15'],
      },
      {
        month: 2,
        label: 'Dias 31–60 — Glúteo Máximo',
        description: 'Treinos do Glúteo Máximo.',
        exerciseIds: ['ex16','ex17','ex18','ex19','ex20','ex21','ex22','ex23','ex24','ex25','ex26','ex27','ex28','ex29','ex30'],
      },
      {
        month: 3,
        label: 'Dias 61–90 — Avançado',
        description: 'Treinos Avançados para máxima transformação.',
        exerciseIds: ['ex31','ex32','ex33','ex34','ex35','ex38','ex40','ex41'],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
export const getExerciseById = (id: string): Exercise | undefined =>
  exercises.find((e) => e.id === id);

export const getExercisesByIds = (ids: string[]): Exercise[] =>
  ids.map((id) => getExerciseById(id)).filter(Boolean) as Exercise[];

export const weeklySchedule = [
  { day: 'Seg', workout: 'Bumbum do Zero', completed: true },
  { day: 'Ter', workout: 'Descanso', completed: false, isRest: true },
  { day: 'Qua', workout: 'Glúteo Máximo', completed: true },
  { day: 'Qui', workout: 'Descanso', completed: false, isRest: true },
  { day: 'Sex', workout: 'Bumbum em Casa', completed: false },
  { day: 'Sáb', workout: 'Cardio Leve', completed: false },
  { day: 'Dom', workout: 'Descanso', completed: false, isRest: true },
];
