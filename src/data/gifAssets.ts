let G: Record<string, any> = {};

try {
  G = {
    tres_apoios_alto:         require('../../Assets/Glúteos/3 APOIOS ALTO.gif'),
    quatro_apoios_cachorro:   require('../../Assets/Glúteos/4 APOIOS CACHORRINHO.gif'),
    quatro_apoios_cruzado:    require('../../Assets/Glúteos/4 APOIOS CRUZADO BRAÇOS EXTENDIDOS.gif'),
    abducao_flexionado:       require('../../Assets/Glúteos/ABDUÇÃO FLEXIONADO.gif'),
    agachamento_flexao:       require('../../Assets/Glúteos/AGACHAMENTO COM FLEXÃO PLANTAR UNI.gif'),
    contracao_quadril:        require('../../Assets/Glúteos/CONTRAÇÃO DE QUADRIL.gif'),
    elevacao_pelvica_uni:     require('../../Assets/Glúteos/ELEVAÇÃO PÉLVICA UNI.gif'),
    flexao_alta:              require('../../Assets/Glúteos/FLEXÃO ALTA.gif'),
    gluteo_abduzido:          require('../../Assets/Glúteos/GLÚTEO ABDUZIDO.gif'),
    sumo_flexao_plantar:      require('../../Assets/Glúteos/SUMÔ ESTÁTICO COM FLEXÃO PLANTAR.gif'),
    sumo_abducao:             require('../../Assets/Glúteos/SUMÔ PÉS EM ABDUÇAO.gif'),
  };
} catch (e) {
  console.warn('gifAssets: falha ao carregar GIFs', e);
}

export default G;
