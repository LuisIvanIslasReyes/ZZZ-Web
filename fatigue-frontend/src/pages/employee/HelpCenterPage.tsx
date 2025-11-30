/**
 * Help Center Page
 * Centro de ayuda para empleados con información útil
 * Diseño ZZZ Admin Style
 */

import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'Todas', icon: '📚' },
    { id: 'fatigue', name: 'Fatiga', icon: '😴' },
    { id: 'breaks', name: 'Descansos', icon: '⏸️' },
    { id: 'recommendations', name: 'Recomendaciones', icon: '💡' },
    { id: 'alerts', name: 'Alertas', icon: '🔔' },
    { id: 'device', name: 'Dispositivo', icon: '⌚' },
    { id: 'account', name: 'Cuenta', icon: '👤' }
  ];

  const faqs: FAQItem[] = [
    // Fatiga
    {
      id: 1,
      category: 'fatigue',
      question: '¿Qué es el nivel de fatiga y cómo se calcula?',
      answer: 'El nivel de fatiga es una métrica que mide tu cansancio físico y mental en una escala de 0 a 100. Se calcula utilizando múltiples factores como: frecuencia cardíaca, variabilidad del ritmo cardíaco, calidad del sueño, patrones de actividad y duración de la jornada laboral. Un nivel mayor a 70 se considera alto y requiere atención inmediata.'
    },
    {
      id: 2,
      category: 'fatigue',
      question: '¿Qué debo hacer si mi nivel de fatiga es alto?',
      answer: 'Si tu nivel de fatiga es alto (mayor a 70), te recomendamos: 1) Tomar un descanso inmediato de al menos 15-20 minutos, 2) Hidratarte adecuadamente, 3) Realizar ejercicios de estiramiento, 4) Notificar a tu supervisor si la situación persiste, 5) Revisar las recomendaciones personalizadas que el sistema genera automáticamente.'
    },
    {
      id: 3,
      category: 'fatigue',
      question: '¿Con qué frecuencia se monitorea mi fatiga?',
      answer: 'El sistema monitorea tu nivel de fatiga de forma continua cada 5 minutos cuando tu dispositivo está conectado. Los datos se sincronizan automáticamente con la plataforma y se analizan en tiempo real para detectar patrones de riesgo y generar alertas tempranas.'
    },
    // Descansos
    {
      id: 4,
      category: 'breaks',
      question: '¿Cómo programo un descanso?',
      answer: 'Puedes programar un descanso desde la sección "Mis Descansos" en el menú lateral. Selecciona el tipo de descanso (corto, largo o comida), indica la fecha y hora, y agrega cualquier nota adicional. Tu supervisor recibirá la solicitud para su aprobación.'
    },
    {
      id: 5,
      category: 'breaks',
      question: '¿Cuánto tiempo tarda en aprobarse un descanso?',
      answer: 'Los descansos son revisados por tu supervisor normalmente dentro de las primeras 2 horas. Recibirás una notificación cuando tu solicitud sea aprobada o rechazada. Los descansos urgentes por fatiga alta suelen aprobarse más rápido.'
    },
    {
      id: 6,
      category: 'breaks',
      question: '¿Puedo cancelar un descanso programado?',
      answer: 'Sí, puedes cancelar descansos que aún estén en estado "Pendiente" desde la página "Mis Descansos". Una vez que un descanso ha sido aprobado o ya ha iniciado, necesitarás contactar a tu supervisor para realizar cambios.'
    },
    // Recomendaciones
    {
      id: 7,
      category: 'recommendations',
      question: '¿Qué son las recomendaciones personalizadas?',
      answer: 'Las recomendaciones personalizadas son sugerencias generadas automáticamente por el sistema basándose en tus métricas de fatiga, patrones de trabajo y análisis de datos históricos. Pueden incluir: cambios en horarios de descanso, rotación de turnos, ejercicios específicos, mejoras en hidratación o rutinas de sueño.'
    },
    {
      id: 8,
      category: 'recommendations',
      question: '¿Debo seguir todas las recomendaciones?',
      answer: 'Las recomendaciones están priorizadas según su importancia. Las de "Alta prioridad" son críticas para tu salud y deberían implementarse lo antes posible. Las de prioridad media y baja son sugerencias de mejora continua. Revisa cada recomendación y, si tienes dudas, consulta con tu supervisor o el departamento de recursos humanos.'
    },
    {
      id: 9,
      category: 'recommendations',
      question: '¿Cómo se generan las recomendaciones?',
      answer: 'Las recomendaciones se generan mediante análisis de inteligencia artificial que evalúa: tus niveles de fatiga promedio, patrones de picos de cansancio, días con mayor dificultad, comparación con rangos saludables, y alertas previas. El sistema identifica áreas de mejora y sugiere acciones específicas y medibles.'
    },
    // Alertas
    {
      id: 10,
      category: 'alerts',
      question: '¿Qué es una alerta de fatiga?',
      answer: 'Una alerta de fatiga es una notificación automática que se genera cuando el sistema detecta un nivel de cansancio que podría afectar tu seguridad o rendimiento. Hay diferentes niveles de severidad: baja, media, alta y crítica. Las alertas incluyen recomendaciones específicas de acción.'
    },
    {
      id: 11,
      category: 'alerts',
      question: '¿Quién puede ver mis alertas?',
      answer: 'Tu supervisor y el equipo de recursos humanos tienen acceso a tus alertas para garantizar tu bienestar y seguridad. Toda la información se maneja de forma confidencial según las políticas de privacidad de la empresa. Las alertas críticas pueden compartirse con personal médico si es necesario.'
    },
    {
      id: 12,
      category: 'alerts',
      question: '¿Puedo desactivar las alertas?',
      answer: 'No se pueden desactivar las alertas ya que son fundamentales para tu seguridad y la de tus compañeros. Sin embargo, puedes ajustar las preferencias de notificación en tu perfil para elegir cómo recibirlas (correo, push, SMS). Las alertas críticas siempre se notifican por todos los medios disponibles.'
    },
    // Dispositivo
    {
      id: 13,
      category: 'device',
      question: '¿Cómo sincronizo mi dispositivo de monitoreo?',
      answer: 'El dispositivo se sincroniza automáticamente mediante Bluetooth cuando está cerca de tu teléfono móvil o estación de trabajo. Asegúrate de tener el Bluetooth activado y la aplicación abierta. La sincronización ocurre cada 5-10 minutos o puedes forzarla manualmente desde la configuración del dispositivo.'
    },
    {
      id: 14,
      category: 'device',
      question: '¿Qué hago si mi dispositivo no se conecta?',
      answer: 'Si tu dispositivo no se conecta: 1) Verifica que el Bluetooth esté activado, 2) Asegúrate de que la batería del dispositivo tenga al menos 20%, 3) Reinicia el dispositivo manteniéndolo presionado 10 segundos, 4) Cierra y vuelve a abrir la aplicación, 5) Si el problema persiste, contacta al equipo de soporte técnico en la extensión 2500.'
    },
    {
      id: 15,
      category: 'device',
      question: '¿Cuánto dura la batería del dispositivo?',
      answer: 'La batería del dispositivo de monitoreo tiene una duración aproximada de 5-7 días con uso normal. Recibirás una notificación cuando la batería esté por debajo del 20%. Se recomienda cargar el dispositivo durante la noche o durante tus días de descanso.'
    },
    // Cuenta
    {
      id: 16,
      category: 'account',
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Puedes cambiar tu contraseña desde tu perfil haciendo clic en el ícono de usuario en la esquina superior derecha y seleccionando "Mi Perfil". Busca la sección "Cambiar Contraseña", ingresa tu contraseña actual y la nueva (mínimo 8 caracteres). Por seguridad, tu contraseña debe incluir letras mayúsculas, minúsculas y números.'
    },
    {
      id: 17,
      category: 'account',
      question: '¿Cómo actualizo mi información personal?',
      answer: 'Puedes actualizar tu información básica como teléfono y correo electrónico desde tu perfil. Para cambios en datos laborales (puesto, departamento, horario), debes contactar al departamento de recursos humanos ya que estos datos requieren autorización administrativa.'
    },
    {
      id: 18,
      category: 'account',
      question: '¿Puedo exportar mis datos personales?',
      answer: 'Sí, tienes derecho a exportar todos tus datos personales según las políticas de privacidad. En tu perfil encontrarás la opción "Exportar Mis Datos" que generará un archivo con toda tu información histórica de fatiga, alertas, descansos y recomendaciones. El proceso puede tardar unos minutos.'
    }
  ];

  const contactOptions = [
    {
      icon: '📞',
      title: 'Soporte Técnico',
      description: 'Problemas con dispositivos o la plataforma',
      contact: 'Ext. 2500 | soporte@empresa.com',
      hours: 'Lun-Vie 8:00-18:00'
    },
    {
      icon: '👥',
      title: 'Recursos Humanos',
      description: 'Consultas sobre políticas y bienestar',
      contact: 'Ext. 2100 | rh@empresa.com',
      hours: 'Lun-Vie 9:00-17:00'
    },
    {
      icon: '🏥',
      title: 'Servicio Médico',
      description: 'Emergencias y consultas de salud',
      contact: 'Ext. 2911 | medico@empresa.com',
      hours: '24/7 Disponible'
    },
    {
      icon: '👷',
      title: 'Seguridad Laboral',
      description: 'Reportar incidentes o riesgos',
      contact: 'Ext. 2300 | seguridad@empresa.com',
      hours: '24/7 Disponible'
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-[#18314F] mb-2">Centro de Ayuda</h1>
        <p className="text-lg text-[#18314F]/70">Encuentra respuestas y recursos para tu bienestar</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar preguntas frecuentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#18314F] focus:border-transparent"
          />
          <svg 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#18314F] mb-4">Categorías</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-[#18314F] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#18314F] mb-4">
          Preguntas Frecuentes {filteredFAQs.length > 0 && `(${filteredFAQs.length})`}
        </h2>
        
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">No se encontraron resultados</p>
            <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-[#18314F] text-left">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFAQ === faq.id ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 py-4 bg-white">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-[#18314F] mb-4">¿Necesitas más ayuda?</h2>
        <p className="text-gray-600 mb-6">
          Si no encontraste la respuesta que buscabas, contacta a nuestros equipos de soporte:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactOptions.map((option, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="text-4xl">{option.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#18314F] mb-1">{option.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                  <p className="text-sm font-medium text-[#18314F] mb-1">{option.contact}</p>
                  <p className="text-xs text-gray-500">{option.hours}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-md p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="text-3xl">💡</div>
          <div>
            <h3 className="font-bold text-[#18314F] mb-2">Consejos Rápidos</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Revisa tu dashboard diariamente para monitorear tu nivel de fatiga</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Programa descansos regulares, especialmente durante jornadas largas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Mantén tu dispositivo cargado y sincronizado en todo momento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Responde a las alertas de fatiga alta inmediatamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Consulta las recomendaciones personalizadas semanalmente</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
