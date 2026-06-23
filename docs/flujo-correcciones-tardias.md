Flujo de correcciones tardías

Objetivo

Este documento describe cómo debe comportarse Buscamenú cuando un restaurante envía una corrección del menú por WhatsApp, especialmente si la corrección llega después de que el menú ya haya sido publicado en el buscador.

El objetivo principal es evitar que el usuario final vea información incorrecta.

Principio general

Si llega una corrección sobre un menú publicado, ese menú deja de considerarse válido hasta que la corrección haya sido revisada y republicada.

La regla práctica es:

corrección recibida → retirada temporal → revisión → republicación

Identificación de correcciones por WhatsApp

Conviene pedir a los restaurantes que, cuando envíen una corrección, incluyan claramente la palabra:

corrección

Por ejemplo:

“Corrección: el segundo plato no es merluza, es bacalao.”

O:

“Corrección del menú de hoy: el precio correcto es 14 euros.”

Esto permitirá que el sistema detecte automáticamente que no se trata de un menú nuevo, sino de una modificación sobre un menú ya recibido o publicado.

Corrección antes de publicar

Si la corrección llega antes de que el menú haya sido publicado, el flujo será:

1. El restaurante envía el menú.
2. El sistema lo interpreta.
3. Se genera una vista previa o PDF.
4. El restaurante envía una corrección.
5. El menú pasa a estado en_revision_por_correccion.
6. Se bloquea la publicación.
7. Se procesa la corrección.
8. Se genera nueva vista previa.
9. El menú vuelve a listo_para_publicar.
10. Entra en el siguiente lote.

En este caso el menú todavía no estaba visible para el usuario final, así que no hace falta retirarlo del buscador.

Corrección después de publicar

Si la corrección llega después de que el menú ya está publicado, el flujo debe ser más estricto:

1. El restaurante envía una corrección por WhatsApp.
2. El sistema detecta la palabra “corrección”.
3. El sistema identifica restaurante y menú afectado.
4. El menú pasa a estado en_revision_por_correccion.
5. La publicación pasa a estado retirada_por_correccion.
6. El menú deja de ser publicable temporalmente.
7. En el siguiente lote, el restaurante se retira del buscador o deja de mostrar ese menú.
8. Se procesa la corrección.
9. Se genera una nueva vista previa.
10. Se valida la versión corregida.
11. El menú vuelve a listo_para_publicar.
12. El sistema lo republica en un lote posterior.

Estados recomendados

Estados de menú:

* recibido
* interpretado
* preview_enviada
* en_ventana_revision
* listo_para_publicar
* publicado
* requiere_revision_manual
* en_revision_por_correccion
* corregido_listo_para_publicar

Estados de publicación:

* pendiente
* lista
* publicada
* retenida_en_revision
* retirada_por_correccion
* republicada
* error

Comportamiento del buscador

El buscador solo debe mostrar menús que cumplan todas estas condiciones:

* restaurante activo;
* restaurante activo en buscador;
* menú en estado listo_para_publicar;
* publicación en estado lista;
* sin revisión manual pendiente;
* sin corrección pendiente;
* fecha de publicación no futura.

Si un menú publicado pasa a retirada_por_correccion, debe desaparecer temporalmente del buscador.

Registro en lotes

Cada lote debe registrar:

* menús publicados;
* menús retenidos;
* menús retirados por corrección;
* motivo de bloqueo;
* fecha y hora del lote.

Ejemplo de motivo de bloqueo:

correccion_recibida

Esto permite reconstruir qué ocurrió si un restaurante pregunta por qué su menú dejó de aparecer temporalmente.

Mensaje al restaurante

Cuando llegue una corrección sobre un menú ya publicado, conviene responder con una plantilla de servicio.

Texto sugerido:

Hola {{1}}, hemos recibido tu corrección sobre el menú del día de {{2}}.

Para evitar mostrar información incorrecta, hemos retirado temporalmente el menú del buscador mientras revisamos los cambios.

Cuando la versión corregida esté lista, te enviaremos una nueva vista previa antes de volver a publicarla.

Plantilla WhatsApp sugerida

Nombre sugerido:

buscamenu_correccion_recibida

Categoría:

Servicio

Idioma:

Español

Uso:

Confirmar al restaurante que se ha recibido una corrección y que el menú queda temporalmente en revisión.

Escenario ya simulado en laboratorio

En el laboratorio se ha simulado el caso de Focaccia:

1. Focaccia estaba publicada.
2. Llega una corrección tardía.
3. Focaccia pasa a en_revision_por_correccion.
4. Su publicación pasa a retirada_por_correccion.
5. Sale temporalmente del buscador.
6. El lote registra 2 publicados y 1 retenido.
7. Tras la corrección, Focaccia vuelve a listo_para_publicar.
8. Se republica.
9. El buscador vuelve a mostrar 3 restaurantes.

Comandos relacionados:

npm run escenario:focaccia-correccion

npm run escenario:focaccia-republicada

npm run generar:lote-airtable-demo

Conclusión

El flujo de correcciones tardías es esencial porque protege la fiabilidad del buscador.

Buscamenú no debe priorizar mantener siempre visible un menú si existe una duda sobre su exactitud. Ante una corrección, la prioridad debe ser retirar temporalmente, revisar y republicar correctamente.