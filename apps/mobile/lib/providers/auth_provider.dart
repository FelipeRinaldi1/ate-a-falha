import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../api_service.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  Map<String, dynamic>? _user;
  bool _isAuthenticated = false;
  bool _isLoading = true;
  String? _errorMessage;

  Map<String, dynamic>? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  AuthProvider() {
    _checkSession();
  }

  Future<void> _checkSession() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _apiService.init();
      final response = await _apiService.dio.get('/users/me');
      if (response.statusCode == 200) {
        _user = response.data;
        _isAuthenticated = true;
      } else {
        _user = null;
        _isAuthenticated = false;
      }
    } catch (e) {
      _user = null;
      _isAuthenticated = false;
      // Session expired or no session exists
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.dio.post('/users/login', data: {
        'email': email,
        'password': password,
      });

      if (response.statusCode == 200) {
        _user = response.data['user'];
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return true;
      }
      
      _errorMessage = 'Falha ao autenticar';
    } on DioException catch (e) {
      _errorMessage = e.response?.data?['message'] ?? 'Erro de rede ou servidor';
    } catch (e) {
      _errorMessage = 'Ocorreu um erro inesperado';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<bool> register(String name, String email, String password) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.dio.post('/users/register', data: {
        'name': name,
        'birthDate': DateTime.now().toIso8601String(),
        'gender': 'MALE',
        'role': 'USER',
        'auth': {
          'email': email,
          'password': password,
        },
      });

      if (response.statusCode == 201) {
        _user = response.data['user'];
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return true;
      }
      
      _errorMessage = 'Falha ao registrar';
    } on DioException catch (e) {
      _errorMessage = e.response?.data?['message'] ?? 'Erro de rede ou servidor';
    } catch (e) {
      _errorMessage = 'Ocorreu um erro inesperado';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _apiService.dio.post('/users/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      await _apiService.cookieJar.deleteAll();
      _user = null;
      _isAuthenticated = false;
      _isLoading = false;
      notifyListeners();
    }
  }
}
