import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:dio/dio.dart';
import '../../api_service.dart';
import 'exercise_details_screen.dart';

class ExerciseSearchScreen extends StatefulWidget {
  const ExerciseSearchScreen({super.key});

  @override
  State<ExerciseSearchScreen> createState() => _ExerciseSearchScreenState();
}

class _ExerciseSearchScreenState extends State<ExerciseSearchScreen> {
  final ApiService _apiService = ApiService();
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _searchController = TextEditingController();
  
  Timer? _debounce;
  String _searchQuery = '';
  String? _selectedMuscle;
  String? _selectedCategory;

  List<dynamic> _exercises = [];
  bool _isLoading = false;
  bool _hasNextPage = true;
  String? _cursorId;

  List<String> _muscles = [];
  List<String> _categories = [];
  bool _isLoadingFilters = false;

  final Map<String, String> _localizedLabels = {
    'pescoco': 'Pescoço',
    'antebraco': 'Antebraço',
    'biceps': 'Bíceps',
    'triceps': 'Tríceps',
    'gluteos': 'Glúteos',
    'trapezio': 'Trapézio',
    'quadriceps': 'Quadríceps',
    'forca': 'Força',
    'alongamento': 'Alongamento',
  };

  @override
  void initState() {
    super.initState();
    _fetchFilterOptions();
    _fetchExercises(reset: true);
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _scrollController.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      if (!_isLoading && _hasNextPage) {
        _fetchExercises();
      }
    }
  }

  void _onSearchChanged(String query) {
    if (_debounce?.isActive ?? false) _debounce!.cancel();
    _debounce = Timer(const Duration(milliseconds: 300), () {
      setState(() {
        _searchQuery = query;
      });
      _fetchExercises(reset: true);
    });
  }

  Future<void> _fetchFilterOptions() async {
    setState(() {
      _isLoadingFilters = true;
    });

    try {
      final response = await _apiService.dio.get('/workout/exercise-catalog', queryParameters: {
        'take': 800,
      });

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        
        final Set<String> musclesSet = {};
        final Set<String> categoriesSet = {};

        for (var item in data) {
          final muscles = item['primaryMuscles'] as List<dynamic>?;
          if (muscles != null) {
            for (var m in muscles) {
              if (m != null && m != 'admin-to-delete' && m != 'chest') {
                musclesSet.add(m.toString());
              }
            }
          }
          final category = item['category'];
          if (category != null && category != 'admin-to-delete' && category != 'streghnt') {
            categoriesSet.add(category.toString());
          }
        }

        setState(() {
          _muscles = musclesSet.toList()..sort((a, b) => _getLabel(a).compareTo(_getLabel(b)));
          _categories = categoriesSet.toList()..sort((a, b) => _getLabel(a).compareTo(_getLabel(b)));
        });
      }
    } catch (e) {
      // Ignore filter loading errors, fallback to empty lists
    } finally {
      setState(() {
        _isLoadingFilters = false;
      });
    }
  }

  String _getLabel(String value) {
    final lower = value.toLowerCase();
    return _localizedLabels[lower] ?? (value.isNotEmpty ? '${value[0].toUpperCase()}${value.substring(1)}' : '');
  }

  Future<void> _fetchExercises({bool reset = false}) async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
      if (reset) {
        _exercises = [];
        _cursorId = null;
        _hasNextPage = true;
      }
    });

    try {
      final Map<String, dynamic> params = {
        'take': 15,
      };

      if (_searchQuery.isNotEmpty) params['name'] = _searchQuery;
      if (_selectedCategory != null) params['category'] = _selectedCategory;
      if (_selectedMuscle != null) params['primaryMuscles'] = _selectedMuscle;
      if (_cursorId != null) params['cursorId'] = _cursorId;

      final response = await _apiService.dio.get('/workout/exercise-catalog', queryParameters: params);

      if (response.statusCode == 200) {
        final List<dynamic> data = response.data;
        setState(() {
          _exercises.addAll(data);
          _hasNextPage = data.length >= 15;
          if (data.isNotEmpty) {
            _cursorId = data.last['id'];
          }
        });
      }
    } catch (e) {
      // Handle error
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final String apiBaseUrl = 'http://10.0.2.2:3333/api/v1';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Exercícios'),
      ),
      body: Column(
        children: [
          // Search & Filters Box
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                TextField(
                  controller: _searchController,
                  onChanged: _onSearchChanged,
                  decoration: InputDecoration(
                    hintText: 'Pesquisar...',
                    prefixIcon: const Icon(Icons.search),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchController.clear();
                              _onSearchChanged('');
                            },
                          )
                        : null,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedMuscle,
                        decoration: InputDecoration(
                          labelText: 'Foco Muscular',
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        items: [
                          const DropdownMenuItem<String>(
                            value: null,
                            child: Text('Todos'),
                          ),
                          ..._muscles.map((m) => DropdownMenuItem(
                                value: m,
                                child: Text(_getLabel(m)),
                              )),
                        ],
                        onChanged: (val) {
                          setState(() {
                            _selectedMuscle = val;
                          });
                          _fetchExercises(reset: true);
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonFormField<String>(
                        value: _selectedCategory,
                        decoration: InputDecoration(
                          labelText: 'Categoria',
                          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        items: [
                          const DropdownMenuItem<String>(
                            value: null,
                            child: Text('Todas'),
                          ),
                          ..._categories.map((c) => DropdownMenuItem(
                                value: c,
                                child: Text(_getLabel(c)),
                              )),
                        ],
                        onChanged: (val) {
                          setState(() {
                            _selectedCategory = val;
                          });
                          _fetchExercises(reset: true);
                        },
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Total indicator
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Text(
                'Exibindo ${_exercises.length} exercícios',
                style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
              ),
            ),
          ),
          const SizedBox(height: 8),

          // Exercises List
          Expanded(
            child: _exercises.isEmpty && _isLoading
                ? const Center(child: CircularProgressIndicator())
                : _exercises.isEmpty
                    ? const Center(child: Text('Nenhum exercício encontrado'))
                    : RefreshIndicator(
                        onRefresh: () => _fetchExercises(reset: true),
                        child: ListView.builder(
                          controller: _scrollController,
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: _exercises.length + 1,
                          itemBuilder: (context, index) {
                            if (index == _exercises.length) {
                              return _hasNextPage
                                  ? const Padding(
                                      padding: EdgeInsets.all(16.0),
                                      child: Center(child: CircularProgressIndicator()),
                                    )
                                  : const SizedBox(height: 32);
                            }

                            final exercise = _exercises[index];
                            final images = exercise['images'] as List<dynamic>?;
                            final String? imagePath = images != null && images.isNotEmpty ? images[0].toString() : null;
                            final exerciseImageUrl = imagePath != null
                                ? '$apiBaseUrl/assets/exercises/${imagePath.endsWith('.webp') ? imagePath : imagePath.replaceAll(RegExp(r'\.[^/.]+$'), '.webp')}'
                                : 'https://placehold.co/80x80?text=Exerc%C3%ADcio';

                            return Card(
                              margin: const EdgeInsets.only(bottom: 12),
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                side: BorderSide(color: theme.colorScheme.outlineVariant),
                                borderRadius: BorderRadius.circular(16),
                              ),
                              child: ListTile(
                                leading: ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
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
                                title: Text(
                                  exercise['name'] ?? '',
                                  style: const TextStyle(fontWeight: FontWeight.bold),
                                ),
                                subtitle: Row(
                                  children: [
                                    Container(
                                      margin: const EdgeInsets.only(top: 4),
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: theme.colorScheme.primaryContainer,
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        _getLabel((exercise['primaryMuscles'] as List<dynamic>?)?.first?.toString() ?? ''),
                                        style: TextStyle(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: theme.colorScheme.onPrimaryContainer,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                trailing: const Icon(Icons.chevron_right),
                                onTap: () {
                                  Navigator.of(context).push(
                                    MaterialPageRoute(
                                      builder: (_) => ExerciseDetailsScreen(exerciseId: exercise['id']),
                                    ),
                                  );
                                },
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
