import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../api_service.dart';

class ActiveWorkoutScreen extends StatefulWidget {
  final String planId;
  final String workoutId;
  final String workoutName;

  const ActiveWorkoutScreen({
    super.key,
    required this.planId,
    required this.workoutId,
    required this.workoutName,
  });

  @override
  State<ActiveWorkoutScreen> createState() => _ActiveWorkoutScreenState();
}

class _ActiveWorkoutScreenState extends State<ActiveWorkoutScreen> {
  final ApiService _apiService = ApiService();

  dynamic _plan;
  dynamic _activeWorkout;
  bool _isLoading = true;
  String? _errorMessage;

  // Track expanded cards
  final Set<String> _expandedExercises = {};
  // Track checked sets
  final Set<String> _checkedSets = {};

  @override
  void initState() {
    super.initState();
    _fetchPlanDetails();
  }

  Future<void> _fetchPlanDetails() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _apiService.dio.get('/workout/plans/${widget.planId}');
      if (response.statusCode == 200) {
        final plan = response.data;
        final workouts = plan['workouts'] as List<dynamic>? ?? [];
        final activeWorkout = workouts.firstWhere(
          (w) => w['id'] == widget.workoutId,
          orElse: () => workouts.isNotEmpty ? workouts.first : null,
        );

        setState(() {
          _plan = plan;
          _activeWorkout = activeWorkout;
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = 'Falha ao carregar treino';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Erro ao conectar ao servidor';
        _isLoading = false;
      });
    }
  }

  void _toggleExpand(String id) {
    setState(() {
      if (_expandedExercises.contains(id)) {
        _expandedExercises.remove(id);
      } else {
        _expandedExercises.add(id);
      }
    });
  }

  void _toggleCheckSet(String setId) {
    setState(() {
      if (_checkedSets.contains(setId)) {
        _checkedSets.remove(setId);
      } else {
        _checkedSets.add(setId);
      }
    });
  }

  void _toggleAllSets(dynamic workoutExercise) {
    final sets = workoutExercise['sets'] as List<dynamic>? ?? [];
    if (sets.isEmpty) return;

    final allChecked = sets.every((s) => _checkedSets.contains(s['id'].toString()));
    
    setState(() {
      for (var s in sets) {
        final setId = s['id'].toString();
        if (allChecked) {
          _checkedSets.remove(setId);
        } else {
          _checkedSets.add(setId);
        }
      }
    });
  }

  bool _isExerciseCompleted(dynamic workoutExercise) {
    final sets = workoutExercise['sets'] as List<dynamic>? ?? [];
    if (sets.isEmpty) return false;
    return sets.every((s) => _checkedSets.contains(s['id'].toString()));
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final String apiBaseUrl = 'http://10.0.2.2:3333/api/v1';

    return Scaffold(
      appBar: AppBar(
        title: Text('${_plan?['name'] ?? 'Carregando...'} - Exercícios'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(child: Text(_errorMessage!))
              : _activeWorkout == null
                  ? const Center(child: Text('Nenhum exercício neste treino.'))
                  : Column(
                      children: [
                        // Workout Header Info
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12.0),
                          child: Center(
                            child: Text(
                              'Treino ${widget.workoutName} - ${_activeWorkout['name'] ?? 'Sem Foco'}',
                              style: theme.textTheme.bodyMedium?.copyWith(
                                color: theme.colorScheme.onSurfaceVariant,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),

                        // Exercises List
                        Expanded(
                          child: ListView.builder(
                            padding: const EdgeInsets.symmetric(horizontal: 16.0),
                            itemCount: (_activeWorkout['workoutExercises'] as List<dynamic>? ?? []).length,
                            itemBuilder: (context, index) {
                              final we = _activeWorkout['workoutExercises'][index];
                              final weId = we['id'].toString();
                              final isExpanded = _expandedExercises.contains(weId);
                              final isCompleted = _isExerciseCompleted(we);

                              final exercise = we['exercise'];
                              final images = exercise?['images'] as List<dynamic>?;
                              final String? imagePath = images != null && images.isNotEmpty ? images[0].toString() : null;
                              final exerciseImageUrl = imagePath != null
                                  ? '$apiBaseUrl/assets/exercises/${imagePath.endsWith('.webp') ? imagePath : imagePath.replaceAll(RegExp(r'\.[^/.]+$'), '.webp')}'
                                  : 'https://placehold.co/60x60?text=Exerc%C3%ADcio';

                              final sets = we['sets'] as List<dynamic>? ?? [];
                              final restTimeSec = sets.isNotEmpty ? sets[0]['restTimeSeconds'] ?? 60 : 60;
                              final restTimeMin = (restTimeSec / 60).toStringAsFixed(0);

                              return Card(
                                margin: const EdgeInsets.only(bottom: 12.0),
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  side: BorderSide(
                                    color: isCompleted ? Colors.green : theme.colorScheme.outlineVariant,
                                    width: isCompleted ? 2.0 : 1.0,
                                  ),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                color: isCompleted ? Colors.green.withOpacity(0.08) : null,
                                child: InkWell(
                                  onTap: () => _toggleExpand(weId),
                                  borderRadius: BorderRadius.circular(16),
                                  child: Column(
                                    children: [
                                      // Top Portion Summary Row
                                      Padding(
                                        padding: const EdgeInsets.all(12.0),
                                        child: Row(
                                          children: [
                                            Checkbox(
                                              value: isCompleted,
                                              onChanged: (val) => _toggleAllSets(we),
                                              shape: const CircleBorder(),
                                              activeColor: Colors.green,
                                            ),
                                            const SizedBox(width: 8),
                                            ClipRRect(
                                              borderRadius: BorderRadius.circular(8.0),
                                              child: Image.network(
                                                exerciseImageUrl,
                                                width: 50,
                                                height: 50,
                                                fit: BoxFit.cover,
                                                errorBuilder: (_, __, ___) => Container(
                                                  width: 50,
                                                  height: 50,
                                                  color: theme.colorScheme.surfaceVariant,
                                                  child: const Icon(Icons.fitness_center),
                                                ),
                                              ),
                                            ),
                                            const SizedBox(width: 12),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text(
                                                    exercise?['name'] ?? '',
                                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                                                  ),
                                                  const SizedBox(height: 4),
                                                  Text(
                                                    '${sets.length} séries • $restTimeMin min desc',
                                                    style: theme.textTheme.bodySmall?.copyWith(
                                                      color: theme.colorScheme.onSurfaceVariant,
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ),
                                            Icon(
                                              isExpanded ? Icons.expand_less : Icons.expand_more,
                                              color: theme.colorScheme.onSurfaceVariant,
                                            ),
                                          ],
                                        ),
                                      ),

                                      // Expanded Sets Table Section
                                      if (isExpanded) ...[
                                        const Divider(height: 1),
                                        
                                        // Sets Header
                                        const Padding(
                                          padding: EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                                          child: Row(
                                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                            children: [
                                              Text('SÉRIE', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                              Text('REPETIÇÕES', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                              Text('CARGA', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                              Text('FEITO', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                                            ],
                                          ),
                                        ),

                                        // Sets list
                                        ...List.generate(sets.length, (sIdx) {
                                          final setItem = sets[sIdx];
                                          final sId = setItem['id'].toString();
                                          final isSetChecked = _checkedSets.contains(sId);

                                          return Card(
                                            margin: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 4.0),
                                            color: isSetChecked
                                                ? theme.colorScheme.surfaceVariant.withOpacity(0.5)
                                                : theme.colorScheme.surfaceVariant,
                                            elevation: 0,
                                            child: InkWell(
                                              onTap: () => _toggleCheckSet(sId),
                                              borderRadius: BorderRadius.circular(8),
                                              child: Padding(
                                                padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                                                child: Row(
                                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                                  children: [
                                                    // Index Badge
                                                    Container(
                                                      width: 32,
                                                      height: 24,
                                                      decoration: BoxDecoration(
                                                        color: isSetChecked
                                                            ? theme.colorScheme.outlineVariant
                                                            : theme.colorScheme.primary,
                                                        borderRadius: BorderRadius.circular(4),
                                                      ),
                                                      child: Center(
                                                        child: Text(
                                                          (sIdx + 1).toString(),
                                                          style: const TextStyle(
                                                            color: Colors.white,
                                                            fontWeight: FontWeight.bold,
                                                            fontSize: 12,
                                                          ),
                                                        ),
                                                      ),
                                                    ),

                                                    // Reps
                                                    Text(
                                                      '${setItem['repetitions'] ?? 0} reps',
                                                      style: TextStyle(
                                                        fontWeight: FontWeight.bold,
                                                        decoration: isSetChecked ? TextDecoration.lineThrough : null,
                                                      ),
                                                    ),

                                                    // Weight
                                                    Text(
                                                      '${setItem['weight'] ?? 0} kg',
                                                      style: TextStyle(
                                                        fontWeight: FontWeight.bold,
                                                        decoration: isSetChecked ? TextDecoration.lineThrough : null,
                                                      ),
                                                    ),

                                                    // Set Checkbox
                                                    Checkbox(
                                                      value: isSetChecked,
                                                      onChanged: (val) => _toggleCheckSet(sId),
                                                      activeColor: Colors.green,
                                                    ),
                                                  ],
                                                ),
                                              ),
                                            ),
                                          );
                                        }),

                                        // Timer rest row
                                        Padding(
                                          padding: const EdgeInsets.all(12.0),
                                          child: Card(
                                            margin: EdgeInsets.zero,
                                            color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
                                            elevation: 0,
                                            child: Padding(
                                              padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
                                              child: Row(
                                                children: [
                                                  const Icon(Icons.timer_outlined, size: 20),
                                                  const SizedBox(width: 8),
                                                  Text(
                                                    'Tempo de Descanso • $restTimeMin Min',
                                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                                  ),
                                                ],
                                              ),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                        ),

                        // Finish workout button
                        Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: ElevatedButton(
                            onPressed: () {
                              Navigator.of(context).pop();
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Treino finalizado com sucesso! 💪'),
                                  backgroundColor: Colors.green,
                                ),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                              foregroundColor: Colors.white,
                              minimumSize: const Size.fromHeight(50),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                              elevation: 0,
                            ),
                            child: const Text('Finalizar Treino', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          ),
                        ),
                      ],
                    ),
    );
  }
}
