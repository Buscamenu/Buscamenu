# Flujo Airtable → generación HTML/JSON

Este documento define el flujo real previsto para pasar de datos internos en Airtable a archivos públicos estáticos de Buscamenú.

El objetivo es que la web pública sea rápida, barata y robusta, especialmente durante la hora punta de comidas.

La regla general de arquitectura es:

* generar antes;
* publicar por lotes;
* servir archivos estáticos;
* evitar procesos pesados cuando el usuario consulta la web.

## 1. Principio general

Buscamenú no debe generar páginas en tiempo real cuando un usuario hace una búsqueda o abre una ficha.

El usuario final debe recibir archivos ya preparados:

* buscar/index.html
* data/busqueda-menus-hoy.json
* restaurantes/{slug}/index.html

La web pública no debe depender de consultas directas a Airtable durante la navegación del usuario.

Airtable funciona como zona interna de gestión. La web pública debe funcionar con HTML y JSON ya generados.

## 2. Riesgo de hora punta

Entre las 13:00 y las 14:30 puede concentrarse la mayor parte del tráfico.

En un escenario realista, podrían coincidir:

* muchos usuarios consultando menús;
* usuarios haciendo varias búsquedas seguidas;
* restaurantes enviando menús durante la mañana;
* actualizaciones pendientes de publicación;
* hasta cientos o miles de restaurantes activos en el sistema.

Por tanto, no sería prudente diseñar un sistema en el que cada búsqueda del usuario active procesos pesados como:

* consultar Airtable;
* interpretar datos;
* generar HTML;
* generar PDF;
* hacer commits;
* desplegar páginas.

La respuesta al usuario debe ser estática y rápida.

## 3. Pregeneración diaria de fichas

Cada mañana, aproximadamente a las 08:00, el sistema debe generar una ficha base para cada restaurante activo.

Esa ficha debe existir aunque todavía no haya menú del día publicado.

La ficha base debe incluir:

* nombre del restaurante;
* slug público;
* municipio;
* dirección;
* teléfono público;
* WhatsApp de reservas, si existe;
* web, si existe;
* enlace a Google Maps;
* categoría o tipo de cocina;
* imagen, logo o bloque visual genérico;
* estado inicial del menú del día.

Si todavía no hay menú recibido, la ficha debe mostrar un estado como:

* menú pendiente de recibir;
* menú no disponible todavía;
* restaurante sin menú publicado hoy.

Esto evita tener que crear la página del restaurante desde cero cuando llega el menú.

## 4. Recepción de menús por WhatsApp

Cuando un restaurante envía un menú por WhatsApp, el sistema debe seguir este flujo:

1. Recibir el mensaje o imagen.
2. Guardar el mensaje original.
3. Interpretar el contenido con IA.
4. Extraer datos estructurados.
5. Guardar los datos limpios en Airtable.
6. Generar una vista previa o PDF limpio.
7. Enviar la vista previa al restaurante.
8. Abrir una ventana breve de revisión.
9. Publicar si no hay objeción o si la corrección queda resuelta.

La recepción del menú no debe implicar inmediatamente un deploy público individual.

## 5. Vista previa para el restaurante

Tras interpretar el menú, Buscamenú debe devolver al restaurante una versión limpia.

Puede ser:

* PDF;
* imagen limpia;
* mensaje estructurado;
* enlace de vista previa.

La finalidad de esta vista previa es doble:

* permitir que el restaurante detecte errores evidentes;
* crear una percepción de proceso controlado y revisable.

El restaurante debe tener una breve ventana para responder con correcciones.

## 6. Ventana de revisión

Después de enviar la vista previa, el sistema debe esperar un breve periodo antes de publicar.

Ejemplo de ventana de revisión:

* 2 minutos;
* 3 minutos;
* otro plazo configurable.

Durante ese tiempo, el menú puede estar en un estado como:

* preview_enviada;
* en_ventana_revision;
* pendiente_de_correccion.

Si el restaurante responde con una corrección, el menú vuelve a interpretación o revisión.

Si no responde dentro del plazo, el menú puede pasar automáticamente a listo_para_publicar.

Esta espera no debe presentarse como un retraso técnico, sino como parte normal del control de calidad.

## 7. Micro-lotes de publicación

Buscamenú no debe hacer un commit y un deploy por cada menú recibido.

En lugar de eso, debe trabajar con micro-lotes frecuentes.

Ejemplo:

* 11:30;
* 11:33;
* 11:36;
* 11:39;
* 11:42.

En cada intervalo, el sistema revisa si existen menús listos para publicar.

Si no hay ningún menú pendiente, no se hace nada.

Si hay uno o varios menús listos, el sistema genera un lote.

La regla es:

* si hay publicaciones pendientes, se genera lote;
* si no hay publicaciones pendientes, no hay commit ni deploy.

Esto evita gastos y despliegues innecesarios.

## 8. Qué hace un lote

Un lote de publicación debe:

1. Buscar menús en estado listo_para_publicar.
2. Agruparlos.
3. Generar o actualizar las fichas HTML necesarias.
4. Actualizar data/busqueda-menus-hoy.json.
5. Registrar el lote en Airtable.
6. Hacer un único commit en GitHub.
7. Provocar un único deploy.
8. Marcar los menús como publicados.

El lote puede contener:

* un solo restaurante;
* varios restaurantes;
* decenas de restaurantes, si coinciden en la misma ventana.

El sistema debe evitar publicar si no hay cambios reales.

## 9. Estados propuestos para Menus

La tabla Menus debería manejar estados claros.

Estados posibles:

* recibido;
* interpretado;
* preview_generada;
* preview_enviada;
* en_ventana_revision;
* correccion_recibida;
* requiere_revision_manual;
* listo_para_publicar;
* publicado;
* descartado;
* error.

Descripción breve:

recibido: el menú ha llegado, pero todavía no se ha interpretado.

interpretado: la IA ha extraído datos estructurados.

preview_generada: existe una versión limpia para revisión.

preview_enviada: la vista previa se ha enviado al restaurante.

en_ventana_revision: se está esperando una posible corrección.

correccion_recibida: el restaurante ha contestado con cambios.

requiere_revision_manual: el sistema no tiene suficiente confianza o hay ambigüedad.

listo_para_publicar: el menú puede entrar en el siguiente micro-lote.

publicado: el menú ya aparece en HTML/JSON público.

descartado: el menú no debe publicarse.

error: hubo un fallo técnico.

## 10. Campos propuestos para Restaurantes

La tabla Restaurantes debería contener los datos estables.

Campos mínimos:

* restaurante_id;
* nombre;
* slug;
* municipio;
* direccion;
* telefono_publico;
* whatsapp_reservas;
* email;
* web;
* google_maps_url;
* lat;
* lng;
* categoria;
* descripcion;
* estado_restaurante;
* imagen_tipo;
* imagen_url;
* activo_en_buscador.

Notas:

El campo slug es esencial porque determina la ruta pública:

restaurantes/{slug}/index.html

La latitud y longitud deben tener suficiente precisión para evitar errores en pueblos con calles pequeñas o irregulares.

La web pública no debería depender directamente de Airtable para mostrar estos datos.

## 11. Campos propuestos para Menus

La tabla Menus debería contener los datos variables del día.

Campos mínimos:

* menu_id;
* restaurante_id;
* fecha_menu;
* estado_menu;
* titulo_menu;
* precio_desde;
* precio_hasta;
* primeros;
* segundos;
* postres;
* bebida_incluida;
* pan_incluido;
* cafe_incluido;
* texto_original;
* texto_interpretado;
* html_menu;
* keywords;
* etiquetas;
* confianza_ia;
* requiere_revision_manual;
* hora_recepcion;
* hora_preview_enviada;
* publicable_desde;
* hora_publicacion.

El campo publicable_desde es clave para los micro-lotes.

Ejemplo:

Si la preview se envía a las 11:31 y la ventana de revisión es de 3 minutos, el menú no entra en un lote hasta las 11:34.

## 12. Campos propuestos para Publicaciones

La tabla Publicaciones o ColaPublicacion debería controlar qué se publica y cuándo.

Campos posibles:

* publicacion_id;
* menu_id;
* restaurante_id;
* estado_publicacion;
* publicable_desde;
* lote_id;
* incluido_en_commit;
* publicado_en;
* ruta_html;
* ruta_json;
* motivo_bloqueo;
* intentos;
* ultimo_error.

Estados posibles:

* pendiente;
* retenida_en_revision;
* lista;
* incluida_en_lote;
* publicada;
* error;
* cancelada.

Esta tabla ayuda a evitar duplicados y a saber qué quedó pendiente.

## 13. Campos propuestos para Lotes

La tabla Lotes debería registrar cada publicación agrupada.

Campos posibles:

* lote_id;
* fecha_hora_inicio;
* fecha_hora_fin;
* estado_lote;
* numero_menus;
* restaurantes_incluidos;
* archivos_generados;
* commit_sha;
* deploy_id;
* resultado;
* errores.

Estados posibles:

* iniciado;
* sin_cambios;
* generado;
* commit_realizado;
* deploy_iniciado;
* publicado;
* error.

Un lote sin cambios no debe hacer commit.

## 14. Archivos generados

El sistema de generación debe producir principalmente:

* restaurantes/{slug}/index.html;
* data/busqueda-menus-hoy.json.

Opcionalmente, más adelante:

* PDFs limpios de menú;
* imágenes optimizadas;
* históricos por restaurante;
* data/restaurantes.json;
* data/municipios/{municipio}.json.

La primera versión debe centrarse en HTML y JSON público.

## 15. JSON público de búsqueda

El archivo data/busqueda-menus-hoy.json debe contener solo datos necesarios para el buscador.

Campos sugeridos:

* restaurante;
* slug;
* municipio;
* url;
* fecha_menu;
* estado_menu;
* lat;
* lng;
* titulo_menu;
* precio_desde;
* precio_hasta;
* platos;
* keywords;
* etiquetas.

Este archivo debe ser ligero y rápido de descargar.

No debe contener datos internos como:

* teléfono privado;
* token;
* notas internas;
* confianza de IA;
* mensajes originales completos;
* estados internos detallados.

## 16. Validaciones antes de publicar

Antes de incluir un menú en un lote, el sistema debe comprobar:

* el restaurante está activo;
* existe slug;
* existe municipio;
* existe ruta pública;
* el menú tiene fecha válida;
* el menú no está descartado;
* el menú no requiere revisión manual;
* el menú ya ha superado la ventana de revisión;
* el menú no ha sido publicado ya;
* el precio es coherente;
* el HTML generado no está vacío;
* el JSON resultante es válido.

Si falla alguna validación, el menú no debe publicarse automáticamente.

## 17. Regla de no hacer deploy vacío

Cada ejecución de micro-lote debe empezar preguntando:

¿Hay algo listo para publicar?

Si la respuesta es no:

* no se genera HTML;
* no se actualiza JSON;
* no se hace commit;
* no se provoca deploy;
* se registra, como mucho, un estado interno sin_cambios si interesa.

Esta regla es esencial para controlar costes.

## 18. Papel de Make

Make puede encargarse de tareas de orquestación:

* recibir eventos;
* mover datos entre WhatsApp y Airtable;
* activar procesos;
* enviar mensajes;
* avisar de errores;
* llamar a servicios externos.

Make no tiene por qué ser el lugar donde viva toda la lógica de generación HTML/JSON.

Puede actuar como coordinador.

## 19. Papel de Railway o servidor Node

Railway o un pequeño servicio Node pueden encargarse de la lógica más pesada:

* leer datos de Airtable;
* generar HTML;
* generar JSON;
* crear lotes;
* hacer commits;
* controlar errores;
* registrar resultados.

Este motor debe estar separado de la web pública.

La web pública solo sirve archivos.

## 20. Papel de GitHub y Netlify

GitHub almacena los archivos generados.

Netlify publica esos archivos como web estática.

El sistema debe evitar:

* un commit por menú;
* un deploy por menú;
* cambios innecesarios;
* commits vacíos.

El objetivo es que cada deploy represente un lote real de cambios.

## 21. Hora punta

Durante la hora punta, la web debe estar ya preparada.

Los usuarios deben consultar:

* buscador estático;
* JSON público;
* fichas HTML;
* mapas y enlaces ya definidos.

No deberían activar:

* consultas a Airtable;
* generación de HTML;
* interpretación de IA;
* generación de PDF;
* commits;
* deploys.

## 22. Piloto inicial

El piloto real debería empezar con pocos restaurantes.

Ejemplo:

* 3 a 5 restaurantes;
* un municipio;
* revisión manual inicial;
* publicación semiautomática;
* micro-lotes controlados.

Objetivos del piloto:

* comprobar que los restaurantes entienden el proceso;
* medir errores de interpretación;
* comprobar tiempos de respuesta;
* validar la utilidad del buscador;
* preparar demostración municipal.

## 23. Resumen de arquitectura

La arquitectura prevista es:

1. Restaurantes envían menús por WhatsApp.
2. Make o webhook recibe el mensaje.
3. Airtable guarda el original.
4. IA interpreta el menú.
5. Se genera vista previa.
6. Se envía vista previa al restaurante.
7. Se espera ventana breve de revisión.
8. El menú pasa a listo_para_publicar.
9. El micro-lote detecta menús pendientes.
10. Node genera HTML y JSON.
11. GitHub recibe un commit único.
12. Netlify publica el lote.
13. Los usuarios consultan archivos estáticos.

## 24. Regla final

La regla principal de Buscamenú debe ser:

Generar antes. Revisar brevemente. Publicar por micro-lotes. Servir estático.
