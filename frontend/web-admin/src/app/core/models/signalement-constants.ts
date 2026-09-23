export type SignalementStatut =
  | 'brouillon'
  | 'en_attente_validation'
  | 'valide'
  | 'rejete'
  | 'priorise'
  | 'affecte'
  | 'en_intervention'
  | 'termine'
  | 'cloture';

export type SignalementPriorite = 'faible' | 'normale' | 'haute' | 'urgente';

export type DangerositeType = 'faible' | 'modere' | 'eleve' | 'extreme';

export function formatStatut(statut: string): string {
  const map: Record<string, string> = {
    'brouillon': 'Brouillon',
    'en_attente_validation': 'En attente',
    'valide': 'Validé',
    'rejete': 'Rejeté',
    'priorise': 'Priorisé',
    'affecte': 'Affecté',
    'en_intervention': 'En intervention',
    'termine': 'Terminé',
    'cloture': 'Clôturé'
  };
  return map[statut] || statut;
}

export function getStatutBadgeClass(statut: string): string {
  switch (statut) {
    case 'brouillon': return 'badge-secondary';
    case 'en_attente_validation': return 'badge-warning';
    case 'valide': return 'badge-success';
    case 'rejete': return 'badge-danger';
    case 'priorise': return 'badge-primary';
    case 'affecte': return 'badge-info';
    case 'en_intervention': return 'badge-warning';
    case 'termine': return 'badge-success';
    case 'cloture': return 'badge-dark';
    default: return 'badge-secondary';
  }
}

export function formatPriorite(priorite?: string | null): string {
  if (!priorite) return 'Non priorisé';
  const map: Record<string, string> = {
    'faible': 'Faible',
    'normale': 'Normale',
    'haute': 'Haute',
    'urgente': 'Urgente'
  };
  return map[priorite] || priorite;
}
