import 'dart:async';
import 'package:flutter/material.dart';
import '../../api_service.dart';

class ExerciseDetailsScreen extends StatefulWidget {
  final String exerciseId;
  const ExerciseDetailsScreen({super.key, required this.exerciseId});

  @override
  State<ExerciseDetailsScreen> createState() => _ExerciseDetailsScreenState();
}

class _ExerciseDetailsScreenState extends State<ExerciseDetailsScreen> {
  final ApiService _apiService = ApiService();
  final PageController _pageController = PageController();
  Timer? _slideshowTimer;
  int _currentImageIndex = 0;

  dynamic _exercise;
  bool _isLoading = true;
  String? _errorMessage;

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
    _fetchExerciseDetails();
  }

  @override
  void dispose() {
    _slideshowTimer?.cancel();
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _fetchExerciseDetails() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await _apiService.dio.get('/workout/exercise-catalog/${widget.exerciseId}');
      if (response.statusCode == 200) {
        setState(() {
          _exercise = response.data;
          _isLoading = false;
        });
        _startSlideshow();
      } else {
        setState(() {
          _errorMessage = 'Falha ao carregar os detalhes do exercício';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Erro de rede ou conexão';
        _isLoading = false;
      });
    }
  }

  void _startSlideshow() {
    final List<dynamic>? images = _exercise?['images'] as List<dynamic>?;
    if (images == null || images.length <= 1) return;

    _slideshowTimer = Timer.periodic(const Duration(milliseconds: 2300), (timer) {
      if (_pageController.hasClients) {
        final nextPage = (_currentImageIndex + 1) % images.length;
        _pageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  String _getLabel(String value) {
    final lower = value.toLowerCase();
    return _localizedLabels[lower] ?? (value.isNotEmpty ? '${value[0].toUpperCase()}${value.substring(1)}' : '');
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final String apiBaseUrl = 'http://10.0.2.2:3333/api/v1';

    return Scaffold(
      appBar: AppBar(
        title: Text(_exercise?['name'] ?? 'Detalhes do Exercício'),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(child: Text(_errorMessage!))
              : _exercise == null
                  ? const Center(child: Text('Exercício não encontrado'))
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          // Images Carousel Box
                          Card(
                            elevation: 0,
                            clipBehavior: Clip.antiAlias,
                            shape: RoundedRectangleBorder(
                              side: BorderSide(color: theme.colorScheme.outlineVariant),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Column(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.all(12.0),
                                  child: Align(
                                    alignment: Alignment.centerLeft,
                                    child: Text(
                                      'IMAGENS DO EXERCÍCIO',
                                      style: theme.textTheme.labelMedium?.copyWith(
                                        color: theme.colorScheme.onSurfaceVariant,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  height: 240,
                                  color: Colors.black12,
                                  child: _buildImagesSlider(apiBaseUrl, theme),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Title
                          Text(
                            _exercise['name'] ?? '',
                            textAlign: TextAlign.center,
                            style: theme.textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 20),

                          // Muscle and Type Details Card
                          Card(
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              side: BorderSide(color: theme.colorScheme.outlineVariant),
                              borderRadius: BorderRadius.circular(16),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(16.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  // Focus Muscles
                                  Text(
                                    'Foco:',
                                    style: theme.textTheme.titleSmall?.copyWith(
                                      color: theme.colorScheme.onSurfaceVariant,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 8,
                                    children: [
                                      ...((_exercise['primaryMuscles'] as List<dynamic>?) ?? []).map((m) => Chip(
                                            label: Text(_getLabel(m.toString())),
                                            backgroundColor: theme.colorScheme.primaryContainer,
                                            labelStyle: TextStyle(
                                              color: theme.colorScheme.onPrimaryContainer,
                                              fontSize: 12,
                                            ),
                                            side: BorderSide.none,
                                          )),
                                      ...((_exercise['secondaryMuscles'] as List<dynamic>?) ?? []).map((m) => Chip(
                                            label: Text(_getLabel(m.toString())),
                                            backgroundColor: Colors.transparent,
                                            labelStyle: TextStyle(
                                              color: theme.colorScheme.onSurfaceVariant,
                                              fontSize: 11,
                                            ),
                                            side: BorderSide(color: theme.colorScheme.outlineVariant),
                                          )),
                                    ],
                                  ),
                                  const Divider(height: 24),

                                  // Category / Type
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'Tipo:',
                                        style: theme.textTheme.titleSmall?.copyWith(
                                          color: theme.colorScheme.onSurfaceVariant,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                        decoration: BoxDecoration(
                                          border: Border.all(color: theme.colorScheme.outlineVariant),
                                          borderRadius: BorderRadius.circular(8),
                                        ),
                                        child: Text(
                                          _getLabel(_exercise['category'] ?? ''),
                                          style: TextStyle(
                                            color: theme.colorScheme.onSurface,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 12,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const Divider(height: 24),

                                  // Instructions / Description
                                  Text(
                                    'Instruções:',
                                    style: theme.textTheme.titleSmall?.copyWith(
                                      color: theme.colorScheme.onSurfaceVariant,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  if (_exercise['instructions'] != null &&
                                      (_exercise['instructions'] as List<dynamic>).isNotEmpty)
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: (_exercise['instructions'] as List<dynamic>).map((step) {
                                        final int index = (_exercise['instructions'] as List<dynamic>).indexOf(step) + 1;
                                        return Padding(
                                          padding: const EdgeInsets.only(bottom: 12.0),
                                          child: Row(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              CircleAvatar(
                                                radius: 10,
                                                backgroundColor: theme.colorScheme.primary,
                                                child: Text(
                                                  index.toString(),
                                                  style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                                ),
                                              ),
                                              const SizedBox(width: 12),
                                              Expanded(
                                                child: Text(
                                                  step.toString(),
                                                  style: const TextStyle(fontSize: 13, height: 1.4),
                                                ),
                                              ),
                                            ],
                                          ),
                                        );
                                      }).toList(),
                                    )
                                  else
                                    const Text('Nenhuma instrução disponível para este exercício.'),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildImagesSlider(String apiBaseUrl, ThemeData theme) {
    final List<dynamic>? images = _exercise?['images'] as List<dynamic>?;
    if (images == null || images.isEmpty) {
      return Center(
        child: Image.network(
          'https://placehold.co/600x400?text=Imagens+do+Exerc%C3%ADcio',
          fit: BoxFit.cover,
        ),
      );
    }

    return PageView.builder(
      controller: _pageController,
      onPageChanged: (index) {
        setState(() {
          _currentImageIndex = index;
        });
      },
      itemCount: images.length,
      itemBuilder: (context, index) {
        final img = images[index].toString();
        final exerciseImageUrl = img.startsWith('http')
            ? img
            : '$apiBaseUrl/assets/exercises/${img.endsWith('.webp') ? img : img.replaceAll(RegExp(r'\.[^/.]+$'), '.webp')}';

        return Image.network(
          exerciseImageUrl,
          fit: BoxFit.contain,
          errorBuilder: (_, __, ___) => const Center(child: Icon(Icons.broken_image, size: 48)),
        );
      },
    );
  }
}
