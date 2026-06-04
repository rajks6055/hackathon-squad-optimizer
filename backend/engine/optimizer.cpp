#include <iostream>
#include <vector>
#include <algorithm>
#include <chrono>
#include <random>
#include <cmath>
#include <numeric>

using namespace std;

struct Node {
    int id;
    long long val;
    int deg;
    double score;
};

int main() {
    // Fast I/O
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    auto start_time = chrono::steady_clock::now();
    // Use your testing time limit (5 or 15), change to 295 before submission!
    const double TIME_LIMIT_SEC = 15.0; 

    int n, m;
    if (!(cin >> n >> m)) return 0;

    vector<Node> nodes(n);
    for (int i = 0; i < n; ++i) {
        nodes[i].id = i + 1;
        cin >> nodes[i].val;
        nodes[i].deg = 0;
    }

    vector<vector<int>> adj(n);
    for (int i = 0; i < m; ++i) {
        int u, v;
        cin >> u >> v;
        u--; v--;
        adj[u].push_back(v);
        adj[v].push_back(u);
        nodes[u].deg++;
        nodes[v].deg++;
    }

    mt19937 rng(42); 
    uniform_int_distribution<int> dist_node(0, n - 1);
    uniform_real_distribution<double> dist_prob(0.0, 1.0);
    // This is the magic weapon: Random noise between 20% and 200%
    uniform_real_distribution<double> dist_noise(0.2, 2.0); 

    long long global_best_score = 0;
    vector<bool> global_best_squad(n, false);
    vector<pair<double, long long>> history;
    history.push_back({0.0, 0});

    vector<int> order(n);
    iota(order.begin(), order.end(), 0);

    // THE RESTART LOOP: Keep restarting until time runs out
    while (true) {
        auto now = chrono::steady_clock::now();
        double elapsed = chrono::duration<double>(now - start_time).count();
        if (elapsed > TIME_LIMIT_SEC) break;

        // 1. Randomized Greedy Draft (Escapes the Trap!)
        for (int i = 0; i < n; ++i) {
            // Apply random noise to the heuristic to break symmetry
            nodes[i].score = ((double)nodes[i].val / (nodes[i].deg + 1.0)) * dist_noise(rng);
        }
        
        sort(order.begin(), order.end(), [&](int a, int b) {
            if (nodes[a].score == nodes[b].score) return nodes[a].val > nodes[b].val;
            return nodes[a].score > nodes[b].score;
        });

        vector<bool> in_squad(n, false);
        long long current_score = 0;
        vector<int> conf_cnt(n, 0); 

        for (int u : order) {
            if (conf_cnt[u] == 0) {
                in_squad[u] = true;
                current_score += nodes[u].val;
                for (int v : adj[u]) conf_cnt[v]++;
            }
        }

        // 2. Short burst of Simulated Annealing to polish the random draft
        double temp = 5000.0;
        double cooling_rate = 0.9995;

        for (int step = 0; step < 20000; ++step) {
            int u = dist_node(rng);
            long long delta = 0;
            vector<int> to_remove;

            if (in_squad[u]) {
                delta = -nodes[u].val;
            } else {
                delta = nodes[u].val;
                for (int v : adj[u]) {
                    if (in_squad[v]) {
                        delta -= nodes[v].val;
                        to_remove.push_back(v);
                    }
                }
            }

            if (delta > 0 || exp(delta / temp) > dist_prob(rng)) {
                current_score += delta;
                if (in_squad[u]) {
                    in_squad[u] = false;
                    for (int v : adj[u]) conf_cnt[v]--;
                } else {
                    in_squad[u] = true;
                    for (int v : adj[u]) conf_cnt[v]++;
                    for (int v : to_remove) {
                        in_squad[v] = false;
                        for (int w : adj[v]) conf_cnt[w]--;
                    }
                }
            }
            temp *= cooling_rate;
        }

        // Did this random restart find a new global maximum?
        if (current_score > global_best_score) {
            global_best_score = current_score;
            global_best_squad = in_squad;
            history.push_back({elapsed, global_best_score});
        }
    }

    // JSON Output Generator
    vector<int> final_ids;
    for (int i = 0; i < n; ++i) {
        if (global_best_squad[i]) final_ids.push_back(nodes[i].id);
    }

    cout << "{\n";
    cout << "  \"maxScore\": " << global_best_score << ",\n";
    cout << "  \"totalSelected\": " << final_ids.size() << ",\n";
    
    cout << "  \"squad\": [\n";
    for (size_t i = 0; i < final_ids.size(); ++i) {
        int orig_idx = final_ids[i] - 1;
        cout << "    { \"id\": " << final_ids[i] << ", \"rating\": " << nodes[orig_idx].val << " }";
        if (i < final_ids.size() - 1) cout << ",";
        cout << "\n";
    }
    cout << "  ],\n";

    cout << "  \"history\": [\n";
    for (size_t i = 0; i < history.size(); ++i) {
        cout << "    { \"time\": " << history[i].first << ", \"score\": " << history[i].second << " }";
        if (i < history.size() - 1) cout << ",";
        cout << "\n";
    }
    cout << "  ]\n";
    cout << "}\n";

    return 0;
}