<?php

declare(strict_types=1);

namespace App\Enums;

enum SignalementStatutEnum: string
{
    case BROUILLON              = 'brouillon';
    case EN_ATTENTE_VALIDATION  = 'en_attente_validation';
    case VALIDE                 = 'valide';
    case REJETE                 = 'rejete';
    case PRIORISE               = 'priorise';
    case AFFECTE                = 'affecte';
    case EN_INTERVENTION        = 'en_intervention';
    case TERMINE                = 'termine';
    case CLOTURE                = 'cloture';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Transitions autorisées par statut courant (RG15, RG16).
     */
    public function transitionsAutorisees(): array
    {
        return match($this) {
            self::BROUILLON             => [self::EN_ATTENTE_VALIDATION],
            self::EN_ATTENTE_VALIDATION => [self::VALIDE, self::REJETE],
            self::VALIDE                => [self::PRIORISE],
            self::PRIORISE              => [self::AFFECTE],
            self::AFFECTE               => [self::EN_INTERVENTION],
            self::EN_INTERVENTION       => [self::TERMINE],
            self::TERMINE               => [self::CLOTURE],
            self::REJETE, self::CLOTURE => [],
        };
    }

    public function peutEtreAffecte(): bool
    {
        return $this === self::PRIORISE;
    }

    /**
     * Statuts des signalements encore actifs (ni brouillon, ni rejeté,
     * ni clôturé). Utilisés pour la heatmap des zones critiques.
     *
     * @return list<string>
     */
    public static function statutsActifs(): array
    {
        return [
            self::VALIDE->value,
            self::PRIORISE->value,
            self::AFFECTE->value,
            self::EN_INTERVENTION->value,
            self::TERMINE->value,
        ];
    }
}
