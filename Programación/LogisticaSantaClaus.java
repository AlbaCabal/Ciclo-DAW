import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Collections;
import java.util.Map;

public class LogisticaSantaClaus {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);
        Character opcion;

        // --- Estructuras ---
        HashMap<String, Integer> poblacionesTiempos = new HashMap<>();
        //  - Mapa que contiene cada población con su tiempo de reparto
        HashSet<String> poblacionesVisitadas = new HashSet<>();
        //  - Conjunto de poblaciones ya visitadas
        ArrayList<String> poblacionesRuta = new ArrayList<>();
        //  - Lista temporal para calcular y ordenar la ruta con las poblaciones pendientes

        do {
            imprimirMenu();
            opcion = sc.next().toUpperCase().charAt(0);
            sc.nextLine();

            switch (opcion) {
                case 'A':
                    anyadirPoblacion(poblacionesTiempos, sc);
                    break;
                case 'B':
                    visitarPoblacion(poblacionesTiempos, poblacionesVisitadas, sc);
                    break;
                case 'C':
                    calcularRuta(poblacionesTiempos, poblacionesVisitadas, poblacionesRuta);
                    break;
                case 'D':
                    resumenReparto(poblacionesVisitadas, poblacionesTiempos);
                    break;
                case 'E':
                    System.out.println("Saliendo");
                    break;
                default:
                    System.out.println("Opción no válida");
                    break;
            }

        } while (!opcion.equals('E'));
    }

    /**
     * Escribe una lista con las poblaciones visitadas y el tiempo total empleado
     * @param poblacionesVisitadas HashSet de String con solo los nombres de las poblaciones visitadas
     * @param poblacionesTiempos HashMap de String y Integer con todas las poblaciones y sus tiempos
     */
    private static void resumenReparto(HashSet<String> poblacionesVisitadas, HashMap<String, Integer> poblacionesTiempos) {
        int tiempoTotal = 0;
        System.out.println("--- RESUMEN REPARTO ---\n");
        System.out.println("- Poblaciones visitadas: \n");

        for (String poblacion : poblacionesVisitadas) {
            System.out.print("(" + poblacion + ") ");
            tiempoTotal += poblacionesTiempos.get(poblacion);
        }

        System.out.println("\n\n- Tiempo empleado: " + tiempoTotal + " ms\n");
    }

    /**
     * Ordena las poblaciones por tiempo y escribe la ruta ordenando las poblaciones de menor a mayor tiempo
     * @param poblacionesTiempos HashMap de String y Integer con todas las poblaciones y sus tiempos
     * @param poblacionesVisitadas HashSet de String con solo los nombres de las poblaciones visitadas
     * @param poblacionesRuta ArrayList de String vacía
     */
    private static void calcularRuta(HashMap<String, Integer> poblacionesTiempos, HashSet<String> poblacionesVisitadas, ArrayList<String> poblacionesRuta) {
        System.out.println("--- RUTA DE SANTA ---\n");
        poblacionesRuta.clear();

        // Añadir el nombre de las poblaciones al ArrayList poblacionesRuta que no han sido visitadas
        for (String poblacion : poblacionesTiempos.keySet()) {
            if (!poblacionesVisitadas.contains(poblacion)) {
                poblacionesRuta.add(poblacion);
            }
        }

        // Ordenar la ruta según el tiempo de reparto usando un comparador
        Collections.sort(poblacionesRuta, (ciudad1, ciudad2) -> {
            int tiempo1 = poblacionesTiempos.get(ciudad1);
            int tiempo2 = poblacionesTiempos.get(ciudad2);
            return tiempo1 - tiempo2;
        });

        int tiempoTotal = 0;
        int tiempoRestar = 0;

        // Sacar el tiempo total de las poblaciones
        for (Map.Entry<String, Integer> entrada : poblacionesTiempos.entrySet()) {
            tiempoTotal += entrada.getValue();
        }
        // Sacar el tiempo total de las poblaciones visitadas
        for (String poblacion : poblacionesVisitadas) {
            tiempoRestar += poblacionesTiempos.get(poblacion);
        }

        for (String poblacion : poblacionesRuta) {
            System.out.print("->[" + poblacion + "]");
        }
        System.out.println("\n- Tiempo estimado: " +  (tiempoTotal-tiempoRestar) + " ms\n");

    }

    /**
     * Pide la población visitada y la añade en HashSet de poblacionesVisitadas
     * @param poblacionesTiempos HashMap de String y Integer con todas las poblaciones y sus tiempos
     * @param poblacionesVisitadas HashSet de String con solo los nombres de las poblaciones visitadas
     * @param sc Scanner
     */
    private static void visitarPoblacion(HashMap<String, Integer> poblacionesTiempos, HashSet<String> poblacionesVisitadas, Scanner sc) {
        System.out.println("--- VISITAR POBLACIÓN ---\n");
        System.out.println("- Indica la población visitada: ");
        String nombrePob = sc.nextLine();

        if (!poblacionesTiempos.containsKey(nombrePob)) {
            System.out.println("\n[MENSAJE DE ERROR] Población no encontrada\n");
        } else {
            poblacionesVisitadas.add(nombrePob);
            System.out.println("\n[MENSAJE] Población visitada con éxito\n");
        }

    }

    /**
     * Pide población y tiempo y los añade en el HashMap de poblacionesTiempos
     * @param poblacionesTiempos HashMap de String y Integer con todas las poblaciones y sus tiempos
     * @param sc Scanner
     */
    private static void anyadirPoblacion(HashMap<String, Integer> poblacionesTiempos, Scanner sc) {
        System.out.println("--- AÑADIR POBLACIÓN ---\n");

        System.out.println("- Indica el nombre de la población: ");
        String nombre = sc.nextLine();

        if (poblacionesTiempos.containsKey(nombre)) {
            System.out.println("\n[MENSAJE DE ERROR] La población ya existe\n");
            return;
        }

        System.out.println("- Indica el tiempo de reparto (ms): ");
        Integer tiempo = sc.nextInt();
        sc.nextLine();

        poblacionesTiempos.put(nombre, tiempo);
        System.out.println("\n[MENSAJE] Población añadida con éxito\n");

    }

    /**
     * Imprime el menú
     */
    public static void imprimirMenu() {
        System.out.println("--- SANTA MAPS ---");
        System.out.println("A) Añadir población");
        System.out.println("B) Visitar población");
        System.out.println("C) Calcular ruta");
        System.out.println("D) Resumen reparto");
        System.out.println("E) Salir\n");
        System.out.println("- Escoge una opción [A-E]: ");
    }

}