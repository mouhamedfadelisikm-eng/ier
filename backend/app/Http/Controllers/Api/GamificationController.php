<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

final class GamificationController extends Controller
{
    public function leaderboard(Request $request): JsonResponse
    {
        $limit = min(max((int) $request->integer('limit', 20), 1), 100);

        $rows = DB::table('users')
            ->leftJoin('historique_points', 'historique_points.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.nom',
                'users.prenom',
                DB::raw('COALESCE(SUM(historique_points.nombre_points), 0) AS total_points'),
            )
            ->groupBy('users.id', 'users.nom', 'users.prenom')
            ->havingRaw('COALESCE(SUM(historique_points.nombre_points), 0) > 0')
            ->orderByDesc('total_points')
            ->orderBy('users.id')
            ->limit($limit)
            ->get();

        $ranked = $rows->values()->map(static function ($row, int $index): array {
            return [
                'rank' => $index + 1,
                'user' => [
                    'id' => (int) $row->id,
                    'nom' => $row->nom,
                    'prenom' => $row->prenom,
                ],
                'total_points' => (int) $row->total_points,
            ];
        });

        return response()->json([
            'data' => $ranked,
            'meta' => [
                'limit' => $limit,
                'count' => $ranked->count(),
            ],
        ]);
    }
}
