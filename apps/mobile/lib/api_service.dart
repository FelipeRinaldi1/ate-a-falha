import 'package:dio/dio.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:path_provider/path_provider.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;

  late final Dio dio;
  late final PersistCookieJar cookieJar;
  bool _initialized = false;

  ApiService._internal() {
    dio = Dio(BaseOptions(
      // 10.0.2.2 is the special loopback interface to host machine for Android emulator.
      // For iOS emulator or real device, change this to your machine's IP (e.g., 192.168.x.x).
      baseUrl: 'http://10.0.2.2:3333/api/v1',
      connectTimeout: const Duration(seconds: 5),
      receiveTimeout: const Duration(seconds: 5),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));
  }

  Future<void> init() async {
    if (_initialized) return;
    try {
      final appDocDir = await getApplicationDocumentsDirectory();
      final String cookiePath = '${appDocDir.path}/.cookies/';
      cookieJar = PersistCookieJar(
        ignoreExpires: true,
        storage: FileStorage(cookiePath),
      );
      dio.interceptors.add(CookieManager(cookieJar));
      _initialized = true;
    } catch (e) {
      // Fallback to in-memory cookie jar if directory access fails (e.g. tests/desktop)
      dio.interceptors.add(CookieManager(CookieJar()));
      _initialized = true;
    }
  }

  void updateBaseUrl(String newUrl) {
    dio.options.baseUrl = newUrl;
  }
}
