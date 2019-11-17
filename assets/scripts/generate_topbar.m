clear all; close all; clc;

full = imread('../images/mandelbrot_full.png');

% full = [full(:,:,1), full(:,:,3), full(:,:,2)];
structure = full(:,1:9248,2);
% minus = 255-structure;
% full(:,:,1) = minus;
% full(:,:,2) = minus;
% full(:,:,3) = 255*ones(size(full,1), size(full,2));
full = 255-structure;
alpha = structure;

% full = (255-full);

mid = floor(3485/2);

full = imresize(full, 0.5);
alpha = imresize(alpha, 0.5);

upper = full(1:mid,:,:);
upper_alpha = alpha(1:mid,:);

lower = full(mid+1:end,:,:);
lower_alpha = alpha(mid+1:end,:);

imwrite(upper, '../images/mandelbrot_upper.png', 'Alpha', upper_alpha);
imwrite(lower, '../images/mandelbrot_lower.png', 'Alpha', lower_alpha);