import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../api_service.dart';

class ProfileProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();

  List<dynamic> _metrics = [];
  bool _isLoading = false;
  String? _errorMessage;

  List<dynamic> get metrics => _metrics;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchMetrics() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.dio.get('/users/body-metrics', queryParameters: {
        'take': 100,
      });
      if (response.statusCode == 200) {
        _metrics = response.data;
      }
    } on DioException catch (e) {
      _errorMessage = e.response?.data?['message'] ?? 'Erro ao buscar métricas corporais';
    } catch (e) {
      _errorMessage = 'Ocorreu um erro inesperado';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> addMetric({
    required double weight,
    required double height,
    required int activityLevel,
    double? bodyFat,
    double? muscleRate,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.dio.post('/users/body-metrics', data: {
        'weight': weight,
        'height': height,
        'activityLevel': activityLevel,
        if (bodyFat != null) 'bodyFat': bodyFat,
        if (muscleRate != null) 'muscleRate': muscleRate,
      });

      if (response.statusCode == 201 || response.statusCode == 200) {
        await fetchMetrics();
        return true;
      }
    } on DioException catch (e) {
      _errorMessage = e.response?.data?['message'] ?? 'Erro ao salvar métrica';
    } catch (e) {
      _errorMessage = 'Ocorreu um erro inesperado';
    } finally {
      _isLoading = false;
      notifyListeners();
    }
    return false;
  }
}
