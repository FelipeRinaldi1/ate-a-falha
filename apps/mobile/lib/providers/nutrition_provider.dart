import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../api_service.dart';

class NutritionProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<dynamic> _diets = [];
  List<dynamic> _dietLogs = [];
  List<dynamic> _targetMeals = [];
  
  bool _isLoadingDiets = false;
  bool _isLoadingLogs = false;
  bool _isLoadingMeals = false;
  String? _errorMessage;

  List<dynamic> get diets => _diets;
  List<dynamic> get dietLogs => _dietLogs;
  List<dynamic> get targetMeals => _targetMeals;
  
  bool get isLoadingDiets => _isLoadingDiets;
  bool get isLoadingLogs => _isLoadingLogs;
  bool get isLoadingMeals => _isLoadingMeals;
  String? get errorMessage => _errorMessage;

  dynamic get activeDiet {
    if (_diets.isEmpty) return null;
    return _diets.first;
  }

  Future<void> fetchDiets() async {
    _isLoadingDiets = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.dio.get('/nutrition/diets');
      if (response.statusCode == 200) {
        _diets = response.data;
      }
    } on DioException catch (e) {
      _errorMessage = e.response?.data?['message'] ?? 'Erro de rede ou servidor';
    } catch (e) {
      _errorMessage = 'Ocorreu um erro inesperado';
    } finally {
      _isLoadingDiets = false;
      notifyListeners();
    }
  }

  Future<void> fetchDietLogs() async {
    _isLoadingLogs = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.dio.get('/nutrition/diet-logs');
      if (response.statusCode == 200) {
        _dietLogs = response.data;
      }
    } on DioException catch (e) {
      _errorMessage = e.response?.data?['message'] ?? 'Erro de rede ou servidor';
    } catch (e) {
      _errorMessage = 'Ocorreu um erro inesperado';
    } finally {
      _isLoadingLogs = false;
      notifyListeners();
    }
  }

  Future<void> fetchTargetMeals(String dietId) async {
    _isLoadingMeals = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.dio.get('/nutrition/diets/$dietId/meals');
      if (response.statusCode == 200) {
        _targetMeals = response.data;
      }
    } on DioException catch (e) {
      _errorMessage = e.response?.data?['message'] ?? 'Erro de rede ou servidor';
    } catch (e) {
      _errorMessage = 'Ocorreu um erro inesperado';
    } finally {
      _isLoadingMeals = false;
      notifyListeners();
    }
  }

  Future<dynamic> createDietLog(String dateStr) async {
    try {
      final response = await _apiService.dio.post('/nutrition/diet-logs', data: {'date': dateStr});
      if (response.statusCode == 201 || response.statusCode == 200) {
        await fetchDietLogs();
        return response.data;
      }
    } catch (e) {
      // Handle error
    }
    return null;
  }

  Future<void> updateDietLogWater(String logId, int amount) async {
    try {
      await _apiService.dio.patch('/nutrition/diet-logs/$logId', data: {'waterIntake': amount});
      await fetchDietLogs();
    } catch (e) {
      // Handle error
    }
  }

  Future<void> addMealLog(String dietLogId, String name, String time, int orderIndex) async {
    try {
      await _apiService.dio.post('/nutrition/diet-logs/$dietLogId/meals', data: {
        'name': name,
        'time': time,
        'orderIndex': orderIndex,
      });
      await fetchDietLogs();
    } catch (e) {
      // Handle error
    }
  }

  Future<void> removeMealLog(String mealLogId) async {
    try {
      await _apiService.dio.delete('/nutrition/meal-logs/$mealLogId');
      await fetchDietLogs();
    } catch (e) {
      // Handle error
    }
  }

  Future<void> updateWaterGoal(String dietId, int newGoal) async {
    try {
      await _apiService.dio.patch('/nutrition/diets/$dietId', data: {
        'dailyWaterGoal': newGoal,
      });
      await fetchDiets();
    } catch (e) {
      // Handle error
    }
  }

  Future<void> createDiet(Map<String, dynamic> payload) async {
    try {
      await _apiService.dio.post('/nutrition/diets', data: payload);
      await fetchDiets();
    } catch (e) {
      // Handle error
    }
  }

  Future<void> updateDietGoals(String dietId, Map<String, dynamic> payload) async {
    try {
      await _apiService.dio.patch('/nutrition/diets/$dietId', data: payload);
      await fetchDiets();
    } catch (e) {
      // Handle error
    }
  }

  Future<void> toggleReferenceMeal({
    required dynamic targetMeal,
    required bool isLogged,
    String? loggedMealId,
    required String selectedDateStr,
    dynamic activeLog,
  }) async {
    try {
      if (isLogged && loggedMealId != null) {
        await _apiService.dio.delete('/nutrition/meal-logs/$loggedMealId');
      } else {
        String? dietLogId = activeLog?['id']?.toString();
        if (dietLogId == null) {
          final newLog = await createDietLog(selectedDateStr);
          dietLogId = newLog['id']?.toString();
        }

        if (dietLogId != null) {
          final newMealRes = await _apiService.dio.post('/nutrition/diet-logs/$dietLogId/meals', data: {
            'name': targetMeal['name'],
            'time': targetMeal['time'],
            'orderIndex': activeLog?['meals']?.length ?? 0,
          });
          final newMealLogId = newMealRes.data['id']?.toString();

          final List<dynamic> foodsToLog = targetMeal['foods'] as List<dynamic>? ?? [];
          for (var f in foodsToLog) {
            await _apiService.dio.post('/nutrition/meal-logs/$newMealLogId/foods', data: {
              'foodId': f['foodId'],
              'quantity': f['quantity'],
            });
          }
        }
      }
      await fetchDietLogs();
    } catch (e) {
      // Handle error
    }
  }
}
