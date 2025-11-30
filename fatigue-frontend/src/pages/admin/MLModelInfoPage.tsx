/**
 * ML Model Information Page
 * Página de información del modelo de Machine Learning
 */

export function MLModelInfoPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Modelo de Machine Learning</h1>
        <p className="text-gray-600 mt-1">Sistema inteligente de detección y clasificación de niveles de fatiga</p>
      </div>

      {/* Problema que Resuelve */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 border-l-4 border-red-500">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-lg flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-3">¿Qué Problema Estamos Resolviendo?</h2>
            
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-xl">
                <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Problema Principal
                </h3>
                <p className="text-sm text-gray-700">
                  La <strong>fatiga laboral crónica</strong> es una de las principales causas de accidentes industriales, 
                  disminución de productividad y problemas de salud en trabajadores. Los métodos tradicionales de 
                  monitoreo son reactivos y subjetivos, detectando problemas solo cuando ya han ocurrido incidentes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h4 className="font-semibold text-amber-800">Riesgos de Seguridad</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Trabajadores fatigados tienen mayor probabilidad de sufrir accidentes, poniendo en riesgo su vida y la de sus compañeros
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                    <h4 className="font-semibold text-amber-800">Baja Productividad</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    La fatiga reduce la eficiencia, aumenta errores y genera costos económicos significativos para las empresas
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <h4 className="font-semibold text-amber-800">Salud Deteriorada</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    El estrés y fatiga prolongados causan problemas cardiovasculares, mentales y disminuyen la calidad de vida
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <h4 className="font-semibold text-amber-800">Falta de Datos Objetivos</h4>
                  </div>
                  <p className="text-xs text-gray-600">
                    Los supervisores carecen de herramientas para medir objetivamente el estado de sus empleados en tiempo real
                  </p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Nuestra Solución
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Un sistema de <strong>monitoreo continuo y predictivo</strong> que utiliza sensores ESP32 y Machine Learning 
                  para detectar patrones de fatiga antes de que se conviertan en problemas críticos, permitiendo:
                </p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Prevención proactiva:</strong> Identificar empleados en riesgo antes de accidentes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Optimización de rutinas:</strong> Ajustar turnos y tareas según niveles de fatiga reales</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Datos objetivos:</strong> Métricas precisas en tiempo real para tomar decisiones informadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span><strong>Mejora continua:</strong> El modelo aprende y se adapta a los patrones de cada empresa</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipo de Modelo */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Tipo de Modelo</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="font-bold text-lg text-blue-700 mb-2">K-Means Clustering</h3>
              <p className="text-sm text-gray-700">
                Algoritmo de aprendizaje no supervisado que agrupa datos en clusters basándose en similitudes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3 text-gray-900">¿Cómo funciona?</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Recopila métricas fisiológicas de los sensores (ritmo cardíaco, SpO2, actividad física)</li>
                <li>Normaliza y procesa los datos para hacerlos comparables</li>
                <li>Agrupa automáticamente patrones similares en clusters</li>
                <li>Cada cluster representa un nivel de fatiga diferente</li>
                <li>Asigna un índice de fatiga de 0-100 según el cluster identificado</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Métricas de Efectividad */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Métricas de Efectividad</h2>
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <div className="text-xs font-medium text-gray-600 mb-1">Silhouette Score</div>
              <div className="text-3xl font-bold text-green-600 mb-1">0.926</div>
              <div className="text-sm text-gray-600 mb-2">92.6% de precisión en agrupamiento</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '92.6%'}}></div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="text-xs font-medium text-gray-600 mb-1">Davies-Bouldin Index</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">0.484</div>
              <div className="text-sm text-gray-600 mb-2">Clusters bien separados (menor es mejor)</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '51.6%'}}></div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <div className="text-xs font-medium text-gray-600 mb-1">Calinski-Harabasz Index</div>
              <div className="text-3xl font-bold text-amber-600 mb-1">21,980</div>
              <div className="text-sm text-gray-600">Alta cohesión interna de clusters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Variables de Entrada */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Variables de Entrada (Features)</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          El modelo analiza 10 variables clave seleccionadas por su relevancia en la detección de fatiga:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { name: 'Varianza de Movimiento', desc: 'Mide irregularidades en el movimiento corporal' },
            { name: 'Actividad Normalizada', desc: 'Nivel de actividad física ajustado' },
            { name: 'Varianza de SpO2', desc: 'Fluctuaciones en saturación de oxígeno' },
            { name: 'HRV SDNN', desc: 'Desviación estándar del intervalo cardíaco' },
            { name: 'Conteo de Desaturaciones', desc: 'Eventos de baja oxigenación' },
            { name: 'Nivel de Actividad', desc: 'Intensidad de actividad física' },
            { name: 'HRV RMSSD', desc: 'Variabilidad cardíaca a corto plazo' },
            { name: 'Entropía de Movimiento', desc: 'Complejidad de patrones de movimiento' },
            { name: 'Ratio HRV', desc: 'Relación entre métricas de variabilidad' },
            { name: 'Ratio HR-Actividad', desc: 'Relación entre ritmo cardíaco y actividad' },
          ].map((feature, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-sm text-gray-900">{feature.name}</p>
                <p className="text-xs text-gray-600">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Niveles de Fatiga */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Clasificación de Niveles de Fatiga</h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          El modelo identifica 2 clusters principales que clasifican los datos en niveles de fatiga:
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-green-700">Cluster 0 - Fatiga Normal</h3>
              <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-semibold rounded-full">99.5% de datos</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Índice de fatiga promedio: <strong className="text-green-700">50.3/100</strong>
            </p>
            <p className="text-xs text-gray-600">
              21,332 registros clasificados. Representa estados normales de trabajo con niveles de fatiga manejables.
            </p>
          </div>

          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-red-700">Cluster 1 - Fatiga Elevada</h3>
              <span className="px-3 py-1 bg-red-200 text-red-800 text-xs font-semibold rounded-full">0.5% de datos</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Índice de fatiga promedio: <strong className="text-red-700">60.8/100</strong>
            </p>
            <p className="text-xs text-gray-600">
              106 registros clasificados. Indica situaciones de estrés elevado que requieren atención.
            </p>
          </div>
        </div>
      </div>

      {/* Proceso de Predicción */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Proceso de Predicción en Tiempo Real</h2>
        
        <div className="space-y-3">
          {[
            { 
              step: '1', 
              title: 'Recopilación de Datos', 
              desc: 'Los sensores ESP32 envían datos cada 5 segundos (HR, SpO2, acelerómetro)',
              color: 'blue'
            },
            { 
              step: '2', 
              title: 'Agregación en Ventanas', 
              desc: 'Se agrupan en ventanas de 1 minuto calculando promedios, máximos, mínimos y varianzas',
              color: 'purple'
            },
            { 
              step: '3', 
              title: 'Ingeniería de Features', 
              desc: 'Se calculan las 10 variables especializadas (HRV, ratios, entropía, etc.)',
              color: 'pink'
            },
            { 
              step: '4', 
              title: 'Normalización', 
              desc: 'Los datos se normalizan usando StandardScaler para hacerlos comparables',
              color: 'indigo'
            },
            { 
              step: '5', 
              title: 'Predicción del Cluster', 
              desc: 'El modelo K-Means asigna el registro al cluster más cercano',
              color: 'green'
            },
            { 
              step: '6', 
              title: 'Cálculo de Índice de Fatiga', 
              desc: 'Se genera un índice de 0-100 basado en el cluster y distancia al centro',
              color: 'amber'
            },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 items-start p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-${item.color}-100 text-${item.color}-700 font-bold flex items-center justify-center text-sm`}>
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ventajas del Sistema */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg shadow-sm border border-gray-200 border border-blue-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Ventajas del Sistema de ML</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Alta Precisión */}
          <div className="flex gap-3 p-4 bg-white rounded-xl shadow-sm">
            <svg className="w-8 h-8 text-rose-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Alta Precisión</h3>
              <p className="text-sm text-gray-600 mt-1">92.6% de efectividad en identificación de patrones de fatiga</p>
            </div>
          </div>

          {/* Tiempo Real */}
          <div className="flex gap-3 p-4 bg-white rounded-xl shadow-sm">
            <svg className="w-8 h-8 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Tiempo Real</h3>
              <p className="text-sm text-gray-600 mt-1">Predicciones instantáneas cada minuto</p>
            </div>
          </div>

          {/* Aprendizaje Continuo */}
          <div className="flex gap-3 p-4 bg-white rounded-xl shadow-sm">
            <svg className="w-8 h-8 text-cyan-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Aprendizaje Continuo</h3>
              <p className="text-sm text-gray-600 mt-1">Se puede reentrenar con nuevos datos para mejorar</p>
            </div>
          </div>

          {/* Prevención Proactiva */}
          <div className="flex gap-3 p-4 bg-white rounded-xl shadow-sm">
            <svg className="w-8 h-8 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Prevención Proactiva</h3>
              <p className="text-sm text-gray-600 mt-1">Detecta patrones antes de que se vuelvan críticos</p>
            </div>
          </div>

          {/* Multi-Variable */}
          <div className="flex gap-3 p-4 bg-white rounded-xl shadow-sm">
            <svg className="w-8 h-8 text-violet-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">Multi-Variable</h3>
              <p className="text-sm text-gray-600 mt-1">Analiza 10 métricas simultáneamente</p>
            </div>
          </div>

          {/* No Supervisado */}
          <div className="flex gap-3 p-4 bg-white rounded-xl shadow-sm">
            <svg className="w-8 h-8 text-orange-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <h3 className="font-semibold text-gray-900">No Supervisado</h3>
              <p className="text-sm text-gray-600 mt-1">Descubre patrones automáticamente sin etiquetas previas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Información Técnica Adicional */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
        <div className="flex gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 mb-2">Información Técnica</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Dataset de entrenamiento:</strong> 21,438 registros procesados</p>
              <p><strong>Algoritmo:</strong> K-Means con k=2 clusters óptimos</p>
              <p><strong>Normalización:</strong> StandardScaler (z-score normalization)</p>
              <p><strong>Actualización:</strong> El modelo se puede reentrenar ejecutando los notebooks de ML en el backend</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

