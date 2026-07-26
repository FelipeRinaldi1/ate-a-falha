import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../api_service.dart';

class WorkoutProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<dynamic> _plans = [];
  List<dynamic> _exercises = [];
  bool _isLoadingPlans = false;
  bool _isLoadingExercises = false;
  String? _errorMessage;

  List<dynamic> get plans => _plans;
  List<dynamic> get exercises => _exercises;
  bool get isLoadingPlans => _isLoadingPlans;
  bool get isLoadingExercises => _isLoadingExercises;
  String? get errorMessage => _errorMessage;

  dynamic get activePlan {
    if (_plans.isEmpty) return null;
    return _plans.firstWhere((p) => p['isActive'] == true, orElse: () => _plans.first);
  }

  Future<void> fetchPlans() async {
    _isLoadingPlans = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.dio.get('/workout/plans');
      if (response.statusCode == 200) {
        _plans = response.data;
      } else {
        _errorMessage = 'Falha ao buscar planos de treino';
      }
    } on DioException catch (e) {
      _errorMessage = e.response?.data?['message'] ?? 'Erro de rede ou servidor';
    } catch (e) {
      _errorMessage = 'Ocorreu um erro inesperado';
    } finally {
      _isLoadingPlans = false;
      notifyListeners();
    }
  }

  Future<void> fetchExerciseCatalog() async {
    _isLoadingExercises = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.dio.get('/workout/exercise-catalog', queryParameters: {
        'random': true,
      });
      if (response.statusCode == 200) {
        _exercises = response.data;
      } else {
        _errorMessage = 'Falha ao buscar catálogo de exercícios';
      }
    } on DioException catch (e) {
      _errorMessage = e.response?.data?['message'] ?? 'Erro de rede ou servidor';
    } catch (e) {
      _errorMessage = 'Ocorreu um erro inesperado';
    } finally {
      _isLoadingExercises = false;
      notifyListeners();
    }
  }
  
  // Future methods like starting a workout, logging a set, etc. can go here.
}
