precision mediump float;

uniform sampler2D screen;
uniform float time;
uniform vec2 texSize;

varying vec4 vertTexCoord;

void main() {
    const int size = 10;
    vec3 color = vec3(0);
    float t = 0.0;
    for (int i = -size; i <= size; i++) {
        for (int j = -size; j <= size; j++) {
            vec2 c = vertTexCoord.xy + vec2(i, j) / texSize;
            vec3 col = texture2D(screen, c).rgb;
            float d = sqrt(float(j*j + i*i));
            float w = 1.0 / (d + 1.0);
            if (d < float(size))  {
                color += col * w * 4.0 * (0.5 + sin(time) * 0.5);
                t += w;
            }
        }
    }
    color /= t;
    vec3 oc = texture2D(screen, vertTexCoord.xy).rgb;
    color += oc;
    color = vec3(
        clamp(color.r, oc.r, 1.0),
        clamp(color.g, oc.g, 1.0),
        clamp(color.b, oc.b, 1.0)
    );
    gl_FragColor = vec4(color, 1.0);
}