import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../providers/auth_provider.dart';
import '../../providers/profile_provider.dart';
import '../login_screen.dart';
import 'new_metric_screen.dart';

class ProfileTab extends StatefulWidget {
  const ProfileTab({super.key});

  @override
  State<ProfileTab> createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ProfileProvider>(context, listen: false).fetchMetrics();
    });
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final profileProvider = Provider.of<ProfileProvider>(context);
    
    final user = authProvider.user;
    final theme = Theme.of(context);

    // Prepare chart spots from dynamic metrics
    final List<FlSpot> spots = [];
    final metricsList = profileProvider.metrics.reversed.toList();
    for (int i = 0; i < metricsList.length; i++) {
      final num weight = metricsList[i]['weight'] as num? ?? 0.0;
      spots.add(FlSpot(i.toDouble(), weight.toDouble()));
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Perfil', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await authProvider.logout();
              if (context.mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              }
            },
          ),
        ],
      ),
      body: profileProvider.isLoading && profileProvider.metrics.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () async {
                await profileProvider.fetchMetrics();
              },
              child: ListView(
                padding: const EdgeInsets.all(16.0),
                children: [
                  // User info summary
                  Center(
                    child: Column(
                      children: [
                        CircleAvatar(
                          radius: 40,
                          backgroundColor: theme.colorScheme.primaryContainer,
                          child: Text(
                            (user?['name'] as String?)?.substring(0, 1).toUpperCase() ?? 'U',
                            style: theme.textTheme.headlineMedium?.copyWith(
                              color: theme.colorScheme.onPrimaryContainer,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          user?['name'] ?? 'Usuário',
                          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                        ),
                        Text(
                          user?['email'] ?? '',
                          style: theme.textTheme.bodyMedium?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Weight Evolution Graph Card
                  Text(
                    'Evolução do Peso',
                    style: theme.textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  
                  if (spots.isEmpty)
                    Card(
                      elevation: 0,
                      shape: RoundedRectangleBorder(
                        side: BorderSide(color: theme.colorScheme.outlineVariant),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          children: [
                            Icon(Icons.trending_up, size: 48, color: theme.colorScheme.outline),
                            const SizedBox(height: 12),
                            const Text(
                              'Nenhum histórico de peso cadastrado.',
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'Registre seu peso para acompanhar o progresso.',
                              style: theme.textTheme.bodySmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                            ),
                          ],
                        ),
                      ),
                    )
                  else
                    SizedBox(
                      height: 200,
                      child: Card(
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          side: BorderSide(color: theme.colorScheme.outlineVariant),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.only(top: 24, bottom: 12, left: 16, right: 24),
                          child: LineChart(
                            LineChartData(
                              gridData: const FlGridData(show: false),
                              titlesData: FlTitlesData(
                                leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                                bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                    showTitles: true,
                                    getTitlesWidget: (val, meta) {
                                      final int idx = val.toInt();
                                      if (idx >= 0 && idx < metricsList.length) {
                                        final String dateRaw = metricsList[idx]['createdAt'].toString();
                                        if (dateRaw.length >= 10) {
                                          final month = dateRaw.substring(5, 7);
                                          final day = dateRaw.substring(8, 10);
                                          return Padding(
                                            padding: const EdgeInsets.only(top: 4.0),
                                            child: Text('$day/$month', style: const TextStyle(fontSize: 9)),
                                          );
                                        }
                                      }
                                      return const Text('');
                                    },
                                    reservedSize: 18,
                                  ),
                                ),
                              ),
                              borderData: FlBorderData(show: false),
                              lineBarsData: [
                                LineChartBarData(
                                  spots: spots,
                                  isCurved: true,
                                  color: theme.colorScheme.primary,
                                  barWidth: 4,
                                  isStrokeCapRound: true,
                                  dotData: const FlDotData(show: true),
                                  belowBarData: BarAreaData(
                                    show: true,
                                    color: theme.colorScheme.primary.withOpacity(0.15),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  const SizedBox(height: 24),

                  // Actions menu
                  Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      side: BorderSide(color: theme.colorScheme.outlineVariant),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      children: [
                        ListTile(
                          leading: const Icon(Icons.monitor_weight_outlined),
                          title: const Text('Registrar Peso'),
                          trailing: const Icon(Icons.chevron_right),
                          onTap: () async {
                            final success = await Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const NewMetricScreen()),
                            );
                            if (success == true) {
                              profileProvider.fetchMetrics();
                            }
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
