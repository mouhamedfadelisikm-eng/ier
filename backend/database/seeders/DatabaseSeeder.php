<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\DangerositeEnum;
use App\Enums\InterventionStatutEnum;
use App\Enums\RoleEnum;
use App\Enums\SignalementPrioriteEnum;
use App\Enums\SignalementStatutEnum;
use App\Models\Affectation;
use App\Models\Equipe;
use App\Models\HistoriquePoint;
use App\Models\Intervention;
use App\Models\Signalement;
use App\Models\TypeDechet;
use App\Models\User;
use App\Models\Zone;
use Illuminate\Database\Seeder;

final class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
        ]);

        // 1. Zones réelles — communes et quartiers de Dakar
        $zonesDef = [
            'Gueule Tapée'        => 'Quartier du centre-ville, commune de Dakar',
            'Médina'              => 'Commune de Dakar, forte densité',
            'Plateau'             => 'Quartier administratif et d’affaires',
            'Fann-Mermoz'         => 'Zone universitaire et résidentielle',
            'Ouakam'              => 'Quartier côtier à l’ouest de la presqu’île',
            'Ngor'                => 'Quartier touristique de la langue de Barbarie',
            'Sacré-Cœur'              => 'Quartier résidentiel du nord de Dakar',
            'Grand Yoff'          => 'Grands quartiers populaires du nord de Dakar',
            'Parcelles Assainies' => 'Quartier planifié du nord de Dakar',
            'Keur Massar'         => 'Commune de banlieue est de Dakar',
        ];

        $zones = collect();
        foreach ($zonesDef as $nomZone => $descZone) {
            $zones->push(Zone::create([
                'nom_zone' => $nomZone,
                'description' => $descZone,
            ]));
        }
        $zonesByName = $zones->keyBy('nom_zone');

        // 2. Types de déchets couramment collectés
        $typesDef = [
            ['Déchets ménagers', 'Ordures ménagères de toute nature'],
            ['Bacs plastiques', 'Sacs, bouteilles et emballages plastique'],
            ['Déchets organiques', 'Restes alimentaires, feuilles, déchets verts'],
            ['Encombrants', 'Appareils électroménagers, meubles, matelas'],
            ['Déchets électroniques', 'Équipements électriques et électroniques hors d’usage'],
            ['Déchets de construction', 'Gravats, briques, plâtre issus des chantiers'],
            ['Déchets dangereux', 'Produits chimiques, batteries, résidus toxiques'],
            ['Verre cassé', 'Bouteilles et vaisselle en verre'],
            ['Carton et papier', 'Cartons d’emballage et papeterie'],
        ];

        $typesDechets = collect();
        foreach ($typesDef as [$libelle, $description]) {
            $typesDechets->push(TypeDechet::create([
                'libelle' => $libelle,
                'description' => $description,
            ]));
        }

        // 3. Utilisateurs — noms du domaine ISIECO (Sénégal)
        $admin = User::factory()->create([
            'nom' => 'Ndiaye',
            'prenom' => 'Moussa',
            'email' => 'admin@isieco.sn',
            'password' => bcrypt('password'),
            'etat_compte' => 'actif',
        ]);
        $admin->assignRole(RoleEnum::ADMIN->value);

        $agentsDef = [
            ['Ndiaye', 'Awa'], ['Diop', 'Ousmane'], ['Sow', 'Binta'],
            ['Faye', 'Cheikh'], ['Ba', 'Fatou'], ['Niang', 'Adja'],
            ['Dieng', 'Modou'], ['Diallo', 'Mariama'],
        ];
        $agents = collect();
        foreach ($agentsDef as [$nom, $prenom]) {
            $agents->push(User::factory()->create([
                'nom' => $nom,
                'prenom' => $prenom,
                'email' => strtolower($prenom) . '.' . strtolower($nom) . '@isieco.sn',
                'password' => bcrypt('password'),
                'telephone' => fake()->unique()->numerify('77#######'),
                'etat_compte' => 'actif',
            ]));
        }
        $agents->each(fn (User $agent) => $agent->assignRole(RoleEnum::AGENT->value));

        $citoyensDef = [
            ['Sall', 'Issa'], ['Gueye', 'Penda'], ['Diouf', 'Assane'], ['Sy', 'Aïcha'],
            ['Cissé', 'Mamadou'], ['Ndoye', 'Coumba'], ['Diédhiou', 'Ibou'],
            ['Sarr', 'Khady'], ['Ka', 'Oussène'], ['Camara', 'Mariama'],
        ];
        $citoyens = collect();
        foreach ($citoyensDef as [$nom, $prenom]) {
            $citoyens->push(User::factory()->create([
                'nom' => $nom,
                'prenom' => $prenom,
                'email' => strtolower($prenom) . '.' . strtolower($nom) . '@mairie.sn',
                'password' => bcrypt('password'),
                'telephone' => fake()->unique()->numerify('77#######'),
                'adresse' => fake()->numberBetween(1, 150) . ', Avenue ' . $nom,
                'etat_compte' => 'actif',
            ]));
        }
        $citoyens->each(fn (User $citoyen) => $citoyen->assignRole(RoleEnum::CITIZEN->value));

        // 4. Équipes sectorielles + couverture des zones
        $equipesDef = [
            ['Équipe Centre', 'Secteur Plateau & Médina', ['Plateau', 'Médina']],
            ['Équipe Ouest', 'Secteur Ouakam / Ngor', ['Ouakam', 'Ngor']],
            ['Équipe Nord', 'Secteur Grand Yoff / Parcelles', ['Grand Yoff', 'Parcelles Assainies']],
            ['Équipe Est', 'Secteur Keur Massar', ['Keur Massar']],
        ];

        $equipes = collect();
        foreach ($equipesDef as [$nomEquipe, $descEquipe, $zonesEquipe]) {
            $equipe = Equipe::create([
                'nom_equipe' => $nomEquipe,
                'description' => $descEquipe,
            ]);
            $equipes->push($equipe);

            $equipe->agents()->attach(
                $agents->random(min(2, $agents->count()))->pluck('id')->all(),
                ['date_debut' => now()->subMonths(3)->toDateString(), 'date_fin' => null, 'fonction' => 'Agent de collecte'],
            );

            foreach ($zonesEquipe as $zoneName) {
                $equipe->zones()->attach($zonesByName->get($zoneName)->id);
            }
        }

        // 5. Signalements réalistes dans Dakar
        $signalementsDef = [
            [
                'description' => 'Dépôt sauvage important de sacs d’ordures au carrefour du chemin de fer, gênant la circulation.',
                'latitude' => 14.6921,
                'longitude' => -17.4469,
                'statut' => SignalementStatutEnum::EN_ATTENTE_VALIDATION,
                'priorite' => SignalementPrioriteEnum::HAUTE,
                'zone' => 'Gueule Tapée',
            ],
            [
                'description' => 'Corne d’ordures non collectées depuis trois semaines dans la Médina, près du marché Sandaga.',
                'latitude' => 14.6781,
                'longitude' => -17.4432,
                'statut' => SignalementStatutEnum::EN_ATTENTE_VALIDATION,
                'priorite' => SignalementPrioriteEnum::URGENTE,
                'zone' => 'Médina',
            ],
            [
                'description' => 'Benne saturée avec de nombreux sacs d’encombrants devant la BCEAO du Plateau.',
                'latitude' => 14.6691,
                'longitude' => -17.4375,
                'statut' => SignalementStatutEnum::VALIDE,
                'priorite' => SignalementPrioriteEnum::NORMALE,
                'zone' => 'Plateau',
            ],
            [
                'description' => 'Monceau de meubles et matelas déposés sur le trottoir de l’avenue Cheikh Anta Diop.',
                'latitude' => 14.6923,
                'longitude' => -17.4591,
                'statut' => SignalementStatutEnum::VALIDE,
                'priorite' => SignalementPrioriteEnum::HAUTE,
                'zone' => 'Fann-Mermoz',
            ],
            [
                'description' => 'Plage polluée de déchets plastiques à Ouakam, près du Port de Pêche.',
                'latitude' => 14.7225,
                'longitude' => -17.4871,
                'statut' => SignalementStatutEnum::PRIORISE,
                'priorite' => SignalementPrioriteEnum::HAUTE,
                'zone' => 'Ouakam',
            ],
            [
                'description' => 'Dépôt de gravats de chantier sur le trottoir au rond-point de Ngor.',
                'latitude' => 14.7586,
                'longitude' => -17.5119,
                'statut' => SignalementStatutEnum::PRIORISE,
                'priorite' => SignalementPrioriteEnum::NORMALE,
                'zone' => 'Ngor',
            ],
            [
                'description' => 'Électroménager abandonné sur la place publique du quartier de Sacré-Cœur.',
                'latitude' => 14.7002,
                'longitude' => -17.4545,
                'statut' => SignalementStatutEnum::AFFECTE,
                'priorite' => SignalementPrioriteEnum::URGENTE,
                'zone' => 'Sacré-Cœur',
            ],
            [
                'description' => 'Accumulation de déchets ménagers dans le caniveau principal de la rue 10 du Grand Yoff.',
                'latitude' => 14.7410,
                'longitude' => -17.4725,
                'statut' => SignalementStatutEnum::AFFECTE,
                'priorite' => SignalementPrioriteEnum::HAUTE,
                'zone' => 'Grand Yoff',
            ],
            [
                'description' => 'Dépôt encombrant au rond-point des Parcelles Assainies (Unité 15), nécessitant l’enlèvement.',
                'latitude' => 14.7090,
                'longitude' => -17.4675,
                'statut' => SignalementStatutEnum::EN_INTERVENTION,
                'priorite' => SignalementPrioriteEnum::NORMALE,
                'zone' => 'Parcelles Assainies',
            ],
            [
                'description' => 'Déchets ménagers éparpillés dans la ruelle des concessions de Keur Massar.',
                'latitude' => 14.7714,
                'longitude' => -17.3314,
                'statut' => SignalementStatutEnum::EN_INTERVENTION,
                'priorite' => SignalementPrioriteEnum::HAUTE,
                'zone' => 'Keur Massar',
            ],
            [
                'description' => 'Ancien dépôt préalablement signalé au carrefour de l’abattoir du Plateau, impactant la circulation.',
                'latitude' => 14.6660,
                'longitude' => -17.4360,
                'statut' => SignalementStatutEnum::TERMINE,
                'priorite' => SignalementPrioriteEnum::URGENTE,
                'zone' => 'Plateau',
            ],
            [
                'description' => 'Accumulation de déchets à la décharge improvisée du sud d’Ouakam, résolu.',
                'latitude' => 14.7250,
                'longitude' => -17.4800,
                'statut' => SignalementStatutEnum::CLOTURE,
                'priorite' => SignalementPrioriteEnum::FAIBLE,
                'zone' => 'Ouakam',
            ],
            [
                'description' => 'Dépôt bloqué d’objets volumineux sur un passage devant faire l’objet d’une étude de la mairie.',
                'latitude' => 14.6761,
                'longitude' => -17.4422,
                'statut' => SignalementStatutEnum::REJETE,
                'priorite' => SignalementPrioriteEnum::FAIBLE,
                'zone' => 'Médina',
            ],
            [
                'description' => 'Collecte complémentaire bouclée — résidus de benne nettoyés sur le site de Grand Yoff.',
                'latitude' => 14.7351,
                'longitude' => -17.4628,
                'statut' => SignalementStatutEnum::CLOTURE,
                'priorite' => SignalementPrioriteEnum::NORMALE,
                'zone' => 'Grand Yoff',
            ],
        ];

        foreach ($signalementsDef as $row) {
            $citoyen = $citoyens->random();
            $signalement = Signalement::create([
                'description' => $row['description'],
                'latitude' => $row['latitude'],
                'longitude' => $row['longitude'],
                'statut' => $row['statut']->value,
                'priorite' => $row['priorite']->value,
                'user_id' => $citoyen->id,
                'zone_id' => $zonesByName->get($row['zone'])->id,
            ]);

            $selected = $typesDechets->random(rand(1, 2));
            foreach ($selected as $type) {
                $signalement->typeDechets()->attach($type->id, [
                    'quantite_estime' => rand(10, 500),
                    'volume_estime' => rand(1, 40),
                    'dangerosite' => rand(0, 1) === 0
                        ? DangerositeEnum::FAIBLE->value
                        : DangerositeEnum::MODERE->value,
                    'remarque' => null,
                ]);
            }
        }

        // 6. Affectations puis interventions — flux opérationnel
        $affectables = Signalement::whereIn('statut', [
            SignalementStatutEnum::AFFECTE->value,
            SignalementStatutEnum::EN_INTERVENTION->value,
            SignalementStatutEnum::TERMINE->value,
        ])->get();

        $equipeList = $equipes->all();
        foreach ($affectables as $i => $signalement) {
            $equipe = $equipeList[$i % count($equipeList)];

            $affectation = Affectation::create([
                'date_heure_affectation' => now()->subDays(rand(1, 14))->format('Y-m-d H:i:s'),
                'observation' => 'Affecté à ' . $equipe->nom_equipe . ' pour enlèvement',
                'equipe_id' => $equipe->id,
                'signalement_id' => $signalement->id,
            ]);

            if (in_array($signalement->statut->value, [
                SignalementStatutEnum::EN_INTERVENTION->value,
                SignalementStatutEnum::TERMINE->value,
            ])) {
                $estTerminee = $signalement->statut === SignalementStatutEnum::TERMINE;
                $fin = $estTerminee ? now()->subDays(rand(1, 7)) : null;

                Intervention::create([
                    'date_heure_debut' => now()->subDays(rand(1, 10))->format('Y-m-d H:i:s'),
                    'date_heure_fin' => $fin?->format('Y-m-d H:i:s'),
                    'statut' => $estTerminee
                        ? InterventionStatutEnum::TERMINEE->value
                        : InterventionStatutEnum::EN_COURS->value,
                    'compte_rendu' => $estTerminee ? 'Enlèvement effectué, site laissé propre.' : null,
                    'observation' => 'Intervention programmée après affectation',
                    'affectation_id' => $affectation->id,
                ]);
            }
        }

        // 7. Points pour les citoyens actifs
        foreach ($citoyens->take(6) as $citoyen) {
            HistoriquePoint::create([
                'nombre_points' => 120,
                'motif' => 'Signalement publié et clôturé',
                'description' => 'Points accumulés pour signalements résolus',
                'date_attribution' => now()->subDays(rand(5, 40))->toDateString(),
                'user_id' => $citoyen->id,
            ]);
        }
    }
}