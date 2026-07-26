import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:mobile/main.dart' as app;
import 'package:mobile/api_service.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Workout Module E2E Test', () {
    testWidgets('Full Workout E2E Flow (Register -> Dashboard -> Search -> Workout Tracking -> Finish)', (tester) async {
      // 1. Point API service to localhost since E2E runs natively on the Linux desktop environment
      ApiService().updateBaseUrl('http://localhost:3333/api/v1');

      // 2. Launch the app
      app.main();
      await tester.pumpAndSettle();

      // 3. Verify Login Screen displays
      expect(find.text('Até a Falha'), findsOneWidget);

      // 4. Navigate to Register Screen
      final registerButton = find.widgetWithText(TextButton, 'Cadastre-se');
      expect(registerButton, findsOneWidget);
      await tester.tap(registerButton);
      await tester.pumpAndSettle(const Duration(seconds: 1));

      // 5. Fill registration form with a unique email to avoid "email already exists" conflicts
      final randomId = Random().nextInt(100000);
      final uniqueEmail = 'e2e_user_$randomId@ateafalha.com';

      expect(find.text('Nova Conta'), findsOneWidget);
      await tester.enterText(find.widgetWithText(TextFormField, 'Nome Completo'), 'E2E Test User');
      await tester.enterText(find.widgetWithText(TextFormField, 'E-mail'), uniqueEmail);
      await tester.enterText(find.widgetWithText(TextFormField, 'Senha'), '123456');
      await tester.enterText(find.widgetWithText(TextFormField, 'Confirmar Senha'), '123456');
      
      // Tap Register submit
      await tester.tap(find.widgetWithText(ElevatedButton, 'Cadastrar'));
      
      // Wait for registration request and automatic transition to Home Screen
      await tester.pumpAndSettle(const Duration(seconds: 4));

      // 6. Verify we successfully authenticated and entered the HomeScreen
      expect(find.text('Treino'), findsWidgets); // Title and Navigation Bar label

      // 7. Test Exercise Search Navigation
      final searchButton = find.byIcon(Icons.search_outlined);
      if (searchButton.evaluate().isNotEmpty) {
        await tester.tap(searchButton);
        await tester.pumpAndSettle(const Duration(seconds: 1));

        // Verify Search page is open
        expect(find.text('Exercícios'), findsWidgets);
        expect(find.widgetWithText(TextField, 'Pesquisar...'), findsOneWidget);

        // Enter search query
        await tester.enterText(find.widgetWithText(TextField, 'Pesquisar...'), 'Supino');
        await tester.pumpAndSettle(const Duration(milliseconds: 500)); // debounce
        await tester.pumpAndSettle(const Duration(seconds: 2)); // wait API request

        // Go back to dashboard
        await tester.tap(find.byType(BackButton));
        await tester.pumpAndSettle(const Duration(seconds: 1));
      }

      // 8. Start Active Workout Session (E2E Integration)
      // Locate start buttons
      final startWorkoutBtn = find.widgetWithText(ElevatedButton, 'Começar Treino');
      final dailyWorkoutBtn = find.textContaining('Começar Treino Diário');

      if (dailyWorkoutBtn.evaluate().isNotEmpty) {
        await tester.tap(dailyWorkoutBtn);
        await tester.pumpAndSettle(const Duration(seconds: 2));

        // Verify we are inside the ActiveWorkout screen
        expect(find.textContaining('SÉRIE'), findsWidgets);

        // Tap the first exercise card to expand it
        final exerciseCard = find.byType(Card).first;
        await tester.tap(exerciseCard);
        await tester.pumpAndSettle(const Duration(milliseconds: 500));

        // Check the first set check box
        final setCheckbox = find.byType(Checkbox).first;
        await tester.tap(setCheckbox);
        await tester.pumpAndSettle(const Duration(milliseconds: 300));

        // Finish the active workout
        final finishBtn = find.widgetWithText(ElevatedButton, 'Finalizar Treino');
        expect(finishBtn, findsOneWidget);
        await tester.tap(finishBtn);
        
        // Wait for SnackBar confirmation and navigation back
        await tester.pumpAndSettle(const Duration(seconds: 2));
        expect(find.textContaining('Treino finalizado com sucesso!'), findsOneWidget);
      }
    });
  });
}
