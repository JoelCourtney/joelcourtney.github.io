clear all; close all; clc;

source = imread('../images/mandelbrot_full.png');

% full = [full(:,:,1), full(:,:,3), full(:,:,2)];
structure = uint8(((source(:,1:9248,2) / 255.) .^ 2) * 255);
minus = 255-structure;
zero = zeros(size(structure,1), size(structure,2));

R = 174/255.;
G = 32/255.;
B = 48/255.;

full(:,:,1) = structure*R;
full(:,:,2) = structure*G;
full(:,:,3) = structure*B;
% full = 255-structure;
alpha = structure;

% full = (255-full);

scale = 0.25;

mid = floor(3485*scale);

full = imresize(full, scale);
alpha = imresize(alpha, scale);

upper = full(floor(mid/2):mid,:,:);
upper_alpha = alpha(floor(mid/2):mid,:);

lower = full(mid+1:(mid+end)/2,:,:);
lower_alpha = alpha(mid+1:(mid+end)/2,:);

imwrite(upper, '../images/mandelbrot_upper.png', 'Alpha', upper_alpha);
imwrite(lower, '../images/mandelbrot_lower.png', 'Alpha', lower_alpha);