---
title: Principal component analysis, a minimal fluff tutorial
date: 2022-05-29
description: PCA explained with less words
---


<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>



<h3 class="border-bottom mb-3 mt-5" id="">Goal of this blog post</h3>

The problem with most PCA explanations is that they are too long and use too much words. 
So this write up tries to cover PCA using less of words, without skipping details.
This blog post is for people who sort of know what PCA is and want to relearn about PCA, but don't have the time to spend reading lenghty articles. 
This blog post is also meant for complete newcomers to PCA, but they might apperciate some more examples, which I will not provide.

In this blogpost you will find:

* What PCA is using less words
* How data analysis with PCA is done (at least in psychology)
* PCA from the "change of basis" perspective
* A derivation of the principal components using Lagrange multipliers
* How to make beautiful plots with base R

The mathy sections can be freely skipped, they are mainly based upon Joliffe's (1955) [PCA book](https://link.springer.com/book/10.1007/b98835). But with a little difference in notation, and some links to wikipedia.

<h3 class="border-bottom mb-3 mt-5" id="">Introduction to PCA</h3>

Lets assume you have a dataset with \\(p\\) continues variables and you want to learn something about the structure in your dataset (Note: there is no dependent variable here), you can use principal component analysis (PCA)

##### What is PCA

PCA is an analysis technique that reweights your orginal \\(p\\) variables to \\(p\\) new variables, called principal components, in such a way that the first principal component is the most important, and then the next, then the next and so on. Important meaning capturing the most variance. Furthermore, the principal components are independent from each other, in other words: they are uncorrelated, when you know something about principal component 1, you know nothing about principal component 2. 

#### Example of PCA

Lets look at an example of PCA. Below you can see plot 1A. In plot 1A you can see two heavily correlated variables: \\(x_1\\) and \\(x_2\\).
In plot 1B you can see red arrows (called eigenvectors). These red arrows are the weights (in the context of PCA also called loadings) to create the principal components, but they are also pointing in the direction where the data has the most variance. 
You can see that in 1C where I plotted a normal distribution on top of the first eigenvector to make the visual argument that in that direction the data has most variance.

<p style="text-align:center;">
    <img src="/pca_plot1.svg"> 
</p>

If we perform PCA on this example, we will get 2 new variables (principal components) the first having the most variation, then another one having the most variation and uncorrelad to the first one. In 2A you can see a plot of the two principal components. Note that the points are still at exactly the same distance from each other but \\(z_1\\) and \\(z_2\\) are not correlated anymore! PCA leaves the structure of your data intact, its just a way to look at exactly the same data from a different perspective. A perspective that is more useful to us, because we know that \\(z_1\\) is more important than \\(z_2\\)!

<p style="text-align:center;">
    <img src="/pca_plot2.svg">
</p>

##### How is PCA useful?

So how is this useful? Lets assume in this example \\(x_1\\) one is the length of a person and \\(x_2\\) is the height of a person. Not surprisingly these two are very correlated with each other. Now lets look at \\(z_1\\) and \\(z_2\\) (they are the same data but presented differently), what could \\(z_1\\) now be? \\(z_1\\) is a summary of \\(x_1\\) and \\(x_2\\) that captures most variation. It could be a size of a person component. Then what could \\(z_2\\) be? Maybe \\(z_2\\) captures individual in bodybody morphology? Maybe its something else? We know its totally uncorrelated with our size component. If its not interesting enough to us we could choose to ignore it and call it junk. 

If we ignore one dimension, and instead we continue with only \\(z_1\\) we have a dimension reduction from 2 to 1. That is why PCA is called a dimension reduction technique. In 2B you can see our new size component. 

So how do you determine determine the number of principal components? You look at the variance of the principal components compared to the others. In this example \\(z_1\\) had a variance of 1.53 and \\(z_1\\) had a variance of 0.09.
So \\(z_1\\) explains (\\(1.53 / (1.53 + 0.09) \approx 0.94\\)) 94% of the variance and \\(z_2\\) (\\(0.09 / (1.53 + 0.09) \approx 0.06\\)) 6% of the variance. One might find 6% not important enough and deem it junk and leave it out.

So how do you determine what the components mean?


<p style="text-align:center;">
    <img src="/pca_plot3.svg">
</p>



<h3 class="border-bottom mb-3 mt-5" id="">Finding the weights of the principal components </h3>

<p>
In this section we will dive into the mathematical derivation of the the principal components. Lots of small properties from calculus, statistics and linear algebra come together here. I put links to the relevant pages if I use a property. This derivation follows the PCA book from Joliffe. I like this derivation because it uses few results that appear to be comming from nowhere. In contrast to the derivation of PCA on wikipedia that uses the Rayleigh quotient, short derivation, but it seems more "magical" and therefore less satisfactory to me.

Our goal is pick \\(\boldsymbol{a}_1\\\) in such a way that the variance of the first principal component \\(\boldsymbol{a}_1^{T} \boldsymbol{x} = \boldsymbol{z}_1\\) is maximal. In this case \\(\boldsymbol{x}\\) is our vector containing \\(p\\) random variables. There are always \\(p\\) principal components to be found. But in practice we do not use them all, because we deem them not important enough because they do not have enough variance in comparison to the important principal components. This is of course subjective.
</p>

<p>
First lets find the first principal component, we do this by solving:

$$ 
\begin{aligned} 
\underset{\boldsymbol{a}_1}{\text{maximize }} f(\boldsymbol{a}_1) &= \text{var}(\boldsymbol{a}_1^{T} \boldsymbol{x}) = \boldsymbol{a}_1^{T} \boldsymbol{\Sigma} \boldsymbol{a}_1 \\\\
\text{subject to } g(\boldsymbol{a}_1) &= \boldsymbol{a}_1^{T} \boldsymbol{a}_1 = 1
\end{aligned}
$$

Note that \\(\text{var}(\boldsymbol{a}_1^{T} \boldsymbol{x}) = \boldsymbol{a}_1^{T} \boldsymbol{\Sigma} \boldsymbol{a}_1\\). You can verify this by checking the basic properties of the variance operator <a href="https://en.wikipedia.org/wiki/Variance#Basic_properties">here</a>

The approach will be: we take the derivative of \\(f(\boldsymbol{a}_1)\\) and set it to \\(0\\) and solve for \\(\boldsymbol{a}_1\\). We will impose the contraint that \\(\boldsymbol{a}_1^{T} \boldsymbol{a}_1 = 1\\) else we could arbitrarily keep increasing \\(\boldsymbol{a}_1\\). This constraint makes the derivation nice.

To maximize, \\( \boldsymbol{a}_1^{T} \boldsymbol{\Sigma} \boldsymbol{a}_1 \\) subject to \\(\boldsymbol{a}_1^{T} \boldsymbol{a}_1 = 1 \\) We are going to use the technique of Lagrange multipliers, please check <a href="https://en.wikipedia.org/wiki/Lagrange_multiplier#Single_constraint">the wikipedia page</a> on Lagrange multipliers because it has an excelent intuitive explanation on how it works. So lets write the previous functions \\(f\\) and \\(g\\) into a new function: 

$$
\underset{\boldsymbol{a}_1}{\text{maximize }} f(\boldsymbol{a}_1) =  \boldsymbol{a}_1^{T} \boldsymbol{\Sigma} \boldsymbol{a}_1 - \lambda ( \boldsymbol{a}_1^{T} \boldsymbol{a}_1 - 1)
$$

Take the derivative and set it to \\(0\\). I use <a href="https://en.wikipedia.org/wiki/Matrix_calculus">this</a> wiki page to check how to take derivatives involving matrices.
$$
\begin{aligned}
\frac{\partial f(\boldsymbol{a}_1)}{\partial\boldsymbol{a}_1} &= \boldsymbol{0} \\\\
2 \boldsymbol{\Sigma} \boldsymbol{a}_1 - 2 \lambda \boldsymbol{a}_1  &= \boldsymbol{0} \\\\
 \boldsymbol{\Sigma} \boldsymbol{a}_1   &= \lambda \boldsymbol{a}_1 
\end{aligned}
$$
This result shows us that \\(\boldsymbol{a}_1\\) is an eigenvector of \\(\boldsymbol{\Sigma}\\) (this is the definition of an eigenvector: \\(\boldsymbol{\Sigma} \boldsymbol{a}_1 = \lambda \boldsymbol{a}_1 \\), see <a href="https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors">here</a> and <a href="https://www.youtube.com/watch?v=PFDu9oVAE-g">this</a> wonderful youtube video by 3Blue1Brown) and \\(\lambda\\) is the eigenvalue belonging to that eigenvector. Left multiplying the previous result by \\(\boldsymbol{a}_1^{T}\\),

$$
\begin{aligned}
 \boldsymbol{\Sigma} \boldsymbol{a}_1   &= \lambda \boldsymbol{a}_1 \\\\
\boldsymbol{a}_1^{T} \boldsymbol{\Sigma} \boldsymbol{a}_1   &=  \lambda \boldsymbol{a}_1^{T} \boldsymbol{a}_1 \\\\
\boldsymbol{a}_1^{T} \boldsymbol{\Sigma} \boldsymbol{a}_1   &=  \lambda 
\end{aligned}
$$

shows that the variance of the first principal component to is equal to the eigenvalue of the first principal component. We know that the covariance matrix \\(\boldsymbol{\Sigma}\\) is positive semi definite
(check <a href="https://stats.stackexchange.com/a/53105/58563">here</a>) and that a positive semi definite matrix has non-negative eigenvalues (check <a href="https://math.stackexchange.com/a/518981">here</a>). Thus, to pick the weights for the first principal components we can pick \\(\boldsymbol{a}_1\\) as the eigenvector of \\(\boldsymbol{\Sigma}\\) with the largest eigenvalue.

</p>
<p>
Now for the second principal component we are going to do the same optimization but with the extra constraint that the second principal component is orthogonal/independent to the first principal component. 

$$ 
\begin{aligned} 
&\underset{\boldsymbol{a}_2}{\text{maximize }} f(\boldsymbol{a}_2) = \text{var}(\boldsymbol{a}_2^{T} \boldsymbol{x}) = \boldsymbol{a}_2^{T} \boldsymbol{\Sigma} \boldsymbol{a}_2 \\\\
&\text{subject to }  \boldsymbol{a}_2^{T} \boldsymbol{a}_2 = 1  \text{ and cov}(\boldsymbol{a}_1^{T} \boldsymbol{x}, \boldsymbol{a}_2^{T} \boldsymbol{x}) = 0.
\end{aligned}
$$

With,

$$
\text{cov}(\boldsymbol{a}_1^{T} \boldsymbol{x}, \boldsymbol{a}_2^{T} \boldsymbol{x}) =
\boldsymbol{a}_2^{T} \Sigma \boldsymbol{a}_1 = \boldsymbol{a}_2^{T} (\lambda \boldsymbol{a}_1) = 
\lambda \boldsymbol{a}_2^{T} \boldsymbol{a}_1 = 0.
$$

Here we used the variance rules again and the definition of eigenvectors. Next we put the equation with constraints in the Lagrangian form again, 

$$
\underset{\boldsymbol{a}_2}{\text{maximize }} f(\boldsymbol{a}_2) =  \boldsymbol{a}_2^{T} \boldsymbol{\Sigma} \boldsymbol{a}_2 - \lambda_2 ( \boldsymbol{a}_2^{T} \boldsymbol{a}_2 - 1) - \phi (\lambda  
\boldsymbol{a}_2^{T} \boldsymbol{a}_1) 
$$

Next we take derivatives again and set them to zero (we first solve for \\(\phi\\), the lagrange multiplier for the second constraint),

$$
\begin{aligned}
\frac{\partial f(\boldsymbol{a}_2)}{\partial\boldsymbol{a}_2} &= \boldsymbol{0} \\\\
2 \boldsymbol{\Sigma} \boldsymbol{a}_2 - 2 \lambda_2 \boldsymbol{a}_2 - \phi \lambda  \boldsymbol{a}_1 &= \boldsymbol{0} \\\\
2 \boldsymbol{a}^{T}_1 \boldsymbol{\Sigma} \boldsymbol{a}_2 - 2 \lambda_2 \boldsymbol{a}^{T}_1 \boldsymbol{a}_2 - \phi \lambda  \boldsymbol{a}^{T}_1 \boldsymbol{a}_1 &= \boldsymbol{a}^{T}_1 \boldsymbol{0} \\\\
\phi \lambda  &=  0 \\\\
\phi  &=  0 
\end{aligned}
$$

Now we know \\(\phi = 0\\), lets solve for \\(\boldsymbol{a}_2\\),

$$
\begin{aligned}
2 \boldsymbol{\Sigma} \boldsymbol{a}_2 - 2 \lambda_2 \boldsymbol{a}_2  &= \boldsymbol{0} \\\\
\boldsymbol{\Sigma} \boldsymbol{a}_2 &=  \lambda_2 \boldsymbol{a}_2.
\end{aligned}
$$

The weights for to make the second principal component is also an eigenvector of \\(\Sigma\\), and \\(\lambda_2\\) its eigenvalue! We know that \\(\boldsymbol{a}_2 \neq \boldsymbol{a}_2\\) else the constraint 
\\(\lambda \boldsymbol{a}_2^{T} \boldsymbol{a}_1 = 0\\) would be violated. So, we can pick the second vector of weights to be the second eigenvector with the second largest eigenvalue!
</p>

<p>
You can repeat this process for the other \(3...p\) components and you find \(\boldsymbol{a}_3...\boldsymbol{a}_p\) to be the other eigenvectors with variances \(\lambda_3 ... \lambda_p\).
</p>



<h3 class="border-bottom mb-3 mt-5" id="">R code that created the plots</h3>

Below you can find the R code to create the plots, I presented here.
I made the plots in base `R`. These days base `R` is not sexy anymore and the cool kids use `ggplot`, at least that is what I see in presentations on conferences and in academic papers.
But with `ggplot2` you have to write a lot of code, and out of the box I don't like the look of ggplot2. 
But base `R` on the other hand looks sexy and you can make whatever you want with very minimal code.

```R
library(MASS)

#########################################################
# Data generation

# Generate some data and center it afterwards
set.seed(1)
S  <- matrix(c(1, 0.9, 0.9, 1), 2 , 2)
X <- mvrnorm(100, c(0.5, 1), S)
X <- scale(X, scale=FALSE)
x1 <- X[, 1]
x2 <- X[, 2]

#########################################################
# Estimation

# Perform the PCA analysis
# Extract the eigenvectors of the covariance matrix
V <- svd(X)$v
d <- svd(X)$d # extract the singular values (d = sqrt(eigenvalues))
d <- d / sum(d) # calculate percentage of variance per component

f <- 5 # some scaling factor to make the plots nice

# determine the principal components
Z <- X %*% V
z1 <- Z[, 1] # 1st component
z2 <- Z[, 2] # 2nd component

#########################################################
# Plots

# lower and upper limits of the plots
ll <- -3
up <- 3
pr <- c(ll, up) # plot range

#########################################################
# plots of x1, x2 and the eigenvectors

scale <- 1.5
# Open a "device" to draw the plot in ratio 3:1 
pdf("pca_plot1.pdf", width = 9 * scale, height = 3 * scale) 
# Set outerplot margins so title won't fall off
par(mfrow=c(1, 3), oma=c(0,0,3,0)) 

plot(x1, x2, xlim = pr, ylim = pr, asp = 1)
title("1A")
abline(h=0, col="grey")
abline(v=0, col="grey")

plot(x1, x2, xlim = pr, ylim = pr, asp = 1)
title("2A")
abline(h=0, col="grey")
abline(v=0, col="grey")
arrows(0, 0, V[1, 1] * d[1] * f, V[2, 1] * d[1] * f, col = "red")
arrows(0, 0, V[2, 1] * d[2] * f, V[2, 2] * d[2] * f, col = "red")

# Project the points in X, onto the first PC
# cbind those projected points to X
# I use the original points and the new projections in segments()
v1 <- V[, 1]
A <- cbind(X, t(v1 %*% t(v1) %*% t(X)))

# create a rotated normal-dist with variance equal to the 1st PC
norm_x <- seq(-4, 4, length=100)
norm_y <- dnorm(seq(-4, 4, length=100), mean = 0, sd = sqrt(var(z1)))
angle <- acos(V[, 1] %*% c(0, 1)) # the angle between the x-axis and the fist eigenvector
rot_mat <- matrix(c(cos(angle), sin(angle), -sin(angle), cos(angle)), 2, 2)
norm_x_y_rotated <- rot_mat %*% t(cbind(norm_x, norm_y * 5)) # rotate normal distribution
# shift the points up a fraction in the opposite direction of the 2nd eigenvector
norm_x_y_rotated <- t(norm_x_y_rotated + -1 * V[, 2] * 0.1) 


plot(x1, x2, xlim = pr, ylim = pr, asp = 1)
title("3A")
abline(h=0, col="grey")
abline(v=0, col="grey")
arrows(0, 0, V[1, 1] * d[1] * f, V[2, 1] * d[1] * f, col = "red")
arrows(0, 0, V[2, 1] * d[2] * f, V[2, 2] * d[2] * f, col = "red")
segments(x0 = A[, 1], y0 = A[, 2], x1 = A[, 3], y1 = A[, 4], col = "darkgreen")
lines(norm_x_y_rotated[, 1], norm_x_y_rotated[, 2])

title("Relationship between x1 and x2 with eigenvectors", outer = TRUE)
dev.off()



#########################################################
# plots of the principal components 

# Plots that show the principal components
pdf("pca_plot2.pdf", width = 6 * scale, height = 3 * scale) 
par(mfrow=c(1, 2), oma=c(0,0,3,0)) 

plot(z1, z2, xlim = pr, ylim = pr, asp  =1)
title("2A")
abline(h=0, col="grey")
abline(v=0, col="grey")
arrows(0, 0, f * d[1], 0, col = "red")
arrows(0, 0, 0, f * d[2], col = "red")

plot(z1, rep(1, length(z1)), type="b", ylab="", yaxt='n')
title("2B")
abline(v=0, col="grey")

title("Relationship between the principal components z1 and z2", outer = TRUE)
dev.off()


#########################################################
# Plots that show the linear transformation

pdf("pca_plot3.pdf", width = 6 * scale, height = 3 * scale) 
par(mfrow=c(1, 2), oma=c(0,0,3,0)) 

plot(x1, x2, xlim = pr, ylim = pr, asp = 1, type="n")
title("3A")
abline(h=0, col="grey")
abline(v=0, col="grey")
arrows(0, 0, V[1, 1] * d[1] * f, V[2, 1] * d[1] * f, col = "red")
arrows(0, 0, V[2, 1] * d[2] * f, V[2, 2] * d[2] * f, col = "red")
arrows(x0 = 0, y0 = 0, x1 = X[, 1], y1 = X[, 2], col = "black", length = 0.05, angle = 20)   


plot(z1, z2, xlim = pr, ylim = pr, asp = 1, type="n")
title("3B")
abline(h=0, col="grey")
abline(v=0, col="grey")
arrows(0, 0, f * d[1], 0, col = "red")
arrows(0, 0, 0, f * d[2], col = "red")
arrows(x0 = 0, y0 = 0, x1 = z1, y1 = z2, col = "black",length = 0.05, angle = 20)  

title("Linear transformation from X to Z", outer = TRUE)
dev.off()


# Note: Afterwards I converted all pdfs to svg with the tool pdf2svg
# I think I could have created svg's from the beginning... :)
```
